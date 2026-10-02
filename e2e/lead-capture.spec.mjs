// Lead capture, 2-step form (design D8, D9; eng review R8, R14).
import { test, expect } from '@playwright/test';

const ok = (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });

async function fillStep1(page, { website = 'mimarca.com.co', email = 'ana@mimarca.com.co' } = {}) {
  const form = page.locator('#contacto form');
  await form.getByLabel('Sitio web').fill(website);
  await form.getByLabel('Correo de trabajo').fill(email);
  await form.getByRole('button', { name: 'Siguiente' }).click();
  return form;
}

test('step 1 → step 2 → confirmation, with need, page and lang in the payload', async ({ page }) => {
  const requests = [];
  await page.route('**/api/contact', async (route) => {
    requests.push(route.request().postDataJSON());
    await ok(route);
  });
  await page.goto('/consultoria-seo/');
  const form = await fillStep1(page);
  await expect(form.getByLabel('Tu nombre')).toBeVisible();
  await form.getByLabel('Tu nombre').fill('Ana Restrepo');
  await form.getByText('Auditoría', { exact: true }).click();
  await form.getByRole('button', { name: 'Enviar' }).click();
  await expect(form.getByRole('status')).toContainText('Listo, Ana.');
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    website: 'mimarca.com.co',
    email: 'ana@mimarca.com.co',
    name: 'Ana Restrepo',
    need: 'auditoria',
    page: '/consultoria-seo/',
    lang: 'es',
    company_fax: '',
  });
});

test('an incomplete email shows an inline error and keeps step 1', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('#contacto form');
  const email = form.getByLabel('Correo de trabajo');
  await email.fill('ana@mimarca');
  await email.blur();
  await expect(form.getByText('Revisa el correo')).toBeVisible();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await form.getByLabel('Sitio web').fill('mimarca.com.co');
  await form.getByRole('button', { name: 'Siguiente' }).click();
  await expect(form.getByLabel('Tu nombre')).toBeHidden();
});

test('a server error keeps what the visitor typed and offers the email fallback', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 500, body: '{"error":"email_failed"}' }));
  await page.goto('/');
  const form = await fillStep1(page);
  await form.getByLabel('Tu nombre').fill('Ana Restrepo');
  await form.getByRole('button', { name: 'Enviar' }).click();
  const banner = form.getByRole('alert').filter({ hasText: 'No pudimos enviar' });
  await expect(banner).toBeVisible();
  await expect(banner.getByRole('link', { name: 'hello@clicroot.com' })).toHaveAttribute('href', 'mailto:hello@clicroot.com');
  await expect(form.getByLabel('Tu nombre')).toHaveValue('Ana Restrepo');
  await expect(form.getByRole('button', { name: 'Enviar' })).toBeEnabled();
});

test('a double click on Enviar sends one request', async ({ page }) => {
  let count = 0;
  await page.route('**/api/contact', async (route) => {
    count += 1;
    await new Promise((r) => setTimeout(r, 400));
    await ok(route);
  });
  await page.goto('/');
  const form = await fillStep1(page);
  await form.getByLabel('Tu nombre').fill('Ana Restrepo');
  const send = form.getByRole('button', { name: 'Enviar' });
  await send.dblclick();
  await expect(form.getByRole('status')).toContainText('Listo');
  expect(count).toBe(1);
});

test('going back to step 1 keeps the values', async ({ page }) => {
  await page.goto('/');
  const form = await fillStep1(page);
  await form.getByRole('button', { name: '← Volver al paso 1' }).click();
  await expect(form.getByLabel('Sitio web')).toHaveValue('mimarca.com.co');
  await expect(form.getByLabel('Correo de trabajo')).toHaveValue('ana@mimarca.com.co');
});

test('?motivo=diagnostico-ia preselects the AI diagnosis and shows its confirmation line', async ({ page }) => {
  await page.route('**/api/contact', ok);
  await page.goto('/?motivo=diagnostico-ia#contacto');
  const form = await fillStep1(page);
  await expect(form.getByRole('radio', { name: 'Diagnóstico IA' })).toBeChecked();
  await form.getByLabel('Tu nombre').fill('Ana');
  await form.getByRole('button', { name: 'Enviar' }).click();
  await expect(form.getByRole('status')).toContainText('fecha de entrega');
});

test('the honeypot stays empty after a normal fill (no real lead is dropped as a bot)', async ({ page }) => {
  const requests = [];
  await page.route('**/api/contact', async (route) => {
    requests.push(route.request().postDataJSON());
    await ok(route);
  });
  await page.goto('/');
  const form = await fillStep1(page);
  await form.getByLabel('Tu nombre').fill('Ana Restrepo');
  await form.getByRole('button', { name: 'Enviar' }).click();
  await expect(form.getByRole('status')).toBeVisible();
  expect(requests[0].company_fax).toBe('');
});

test('English form sends lang "en"', async ({ page }) => {
  const requests = [];
  await page.route('**/api/contact', async (route) => {
    requests.push(route.request().postDataJSON());
    await ok(route);
  });
  await page.goto('/en/');
  const form = page.locator('#contacto form');
  await form.getByLabel('Website').fill('mybrand.com');
  await form.getByLabel('Work email').fill('ana@mybrand.com');
  await form.getByRole('button', { name: 'Next' }).click();
  await form.getByLabel('Your name').fill('Ana');
  await form.getByRole('button', { name: 'Send' }).click();
  await expect(form.getByRole('status')).toContainText('Done, Ana.');
  expect(requests[0]).toMatchObject({ lang: 'en', page: '/en/' });
});
