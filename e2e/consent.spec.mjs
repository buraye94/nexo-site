// Consent banner + PostHog wiring (specs/posthog-rollout). Needs a build with a token:
//   npm run e2e:analytics
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const fake = readFileSync(new URL('./fixtures/posthog-fake.js', import.meta.url), 'utf8');

test.beforeEach(async ({ page }) => {
  await page.route('**/us-assets.i.posthog.com/**', (route) => route.fulfill({ contentType: 'application/javascript', body: fake }));
  await page.route('**/us.i.posthog.com/**', (route) => route.abort());
});

async function requireAnalyticsBuild(page) {
  await page.goto('/');
  test.skip((await page.locator('#consent').count()) === 0, 'build has no PUBLIC_POSTHOG_KEY');
}

test('first visit shows the banner; PostHog runs in on_reject mode on US cloud; no PostHog cookies before deciding', async ({ page, context }) => {
  await requireAnalyticsBuild(page);
  await expect(page.locator('#consent')).toBeVisible();
  const cfg = await page.evaluate(() => window.posthog.config);
  expect(cfg).toMatchObject({ api_host: 'https://us.i.posthog.com', cookieless_mode: 'on_reject', session_recording: { maskAllInputs: true } });
  const cookies = await context.cookies();
  expect(cookies.filter((c) => c.name.startsWith('ph_'))).toHaveLength(0);
});

test('accepting hides the banner and it stays hidden on the next page', async ({ page }) => {
  await requireAnalyticsBuild(page);
  await page.locator('#consent').getByRole('button', { name: 'Aceptar' }).click();
  await expect(page.locator('#consent')).toBeHidden();
  await page.goto('/consultoria-seo/');
  await expect(page.locator('#consent')).toBeHidden();
  expect(await page.evaluate(() => window.posthog.get_explicit_consent_status())).toBe('granted');
});

test('declining hides the banner; "Preferencias de cookies" reopens it', async ({ page }) => {
  await requireAnalyticsBuild(page);
  await page.locator('#consent').getByRole('button', { name: 'Rechazar' }).click();
  await expect(page.locator('#consent')).toBeHidden();
  expect(await page.evaluate(() => window.posthog.get_explicit_consent_status())).toBe('denied');
  await page.getByRole('link', { name: 'Preferencias de cookies' }).click();
  await expect(page.locator('#consent')).toBeVisible();
});

test('a sent lead is captured as lead_submitted with need, page and lang', async ({ page }) => {
  await requireAnalyticsBuild(page);
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
  await page.locator('#consent').getByRole('button', { name: 'Aceptar' }).click();
  const form = page.locator('#contacto form');
  await form.getByLabel('Sitio web').fill('mimarca.com.co');
  await form.getByLabel('Correo de trabajo').fill('ana@mimarca.com.co');
  await form.getByRole('button', { name: 'Siguiente' }).click();
  await form.getByLabel('Tu nombre').fill('Ana');
  await form.getByRole('button', { name: 'Enviar' }).click();
  await expect(form.getByRole('status')).toBeVisible();
  const captured = await page.evaluate(() => window.posthog.captured);
  expect(captured).toContainEqual(['lead_submitted', { need: 'leads', page: '/', lang: 'es' }]);
});
