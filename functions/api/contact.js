// POST /api/contact: sends a lead to hello@clicroot.com through Resend.
// Contract (eng review R13): a valid lead returns 200 {success:true} after one Resend
// call (from noreply@clicroot.com, to hello@clicroot.com, reply_to = visitor);
// invalid input returns 400 {error:<code>}; a missing key or a Resend failure returns 500.

const CORS = {
  'Access-Control-Allow-Origin': 'https://clicroot.com',
  'Content-Type': 'application/json',
};

export const NEEDS = {
  leads: 'Más leads',
  diagnostico: 'Diagnóstico IA',
  auditoria: 'Auditoría',
  otro: 'Otro',
};

const LIMITS = { name: 120, email: 254, website: 300, message: 5000, page: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRODUCTION_HOSTS = new Set(['clicroot.com', 'www.clicroot.com']);

const json = (body, status) => new Response(JSON.stringify(body), { status, headers: CORS });

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const oneLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();
const text = (value) => (typeof value === 'string' ? value.trim() : '');

/** Returns { lead } or { error } with a stable error code for the form's banner. */
export function validateLead(body) {
  if (!body || typeof body !== 'object') return { error: 'invalid_body' };
  const lead = {
    name: text(body.name),
    email: text(body.email),
    website: text(body.website),
    message: text(body.message),
    need: text(body.need),
    page: text(body.page),
    lang: body.lang === 'en' ? 'en' : 'es',
  };
  if (!lead.name) return { error: 'name_required' };
  if (lead.name.length > LIMITS.name) return { error: 'name_too_long' };
  if (!lead.email) return { error: 'email_required' };
  if (lead.email.length > LIMITS.email || !EMAIL_RE.test(lead.email)) return { error: 'email_invalid' };
  if (lead.website.length > LIMITS.website) return { error: 'website_too_long' };
  if (lead.message.length > LIMITS.message) return { error: 'message_too_long' };
  if (!Object.hasOwn(NEEDS, lead.need)) return { error: 'need_invalid' };
  // The source page is metadata: an odd value is dropped, never a reason to lose the lead.
  if (!lead.page.startsWith('/') || lead.page.startsWith('//') || lead.page.length > LIMITS.page) lead.page = '';
  return { lead };
}

export function buildEmail(lead, { preview }) {
  const need = NEEDS[lead.need];
  const subject = oneLine(`${preview ? '[preview] ' : ''}${need} · ${lead.page || '/'} · ${lead.name}`);
  const row = (label, value) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#5E5A4C">${label}</td><td style="padding:4px 0">${escapeHtml(value || '-')}</td></tr>`;
  const html = `
    <h2 style="font-family:sans-serif">Nuevo lead desde clicroot.com</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${row('Necesita', need)}
      ${row('Nombre', lead.name)}
      ${row('Correo', lead.email)}
      ${row('Sitio', lead.website)}
      ${row('Página', lead.page || '/')}
      ${row('Idioma', lead.lang)}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(lead.message || '(sin mensaje)')}</p>
  `;
  return {
    from: 'clicroot <noreply@clicroot.com>',
    to: ['hello@clicroot.com'],
    reply_to: lead.email,
    subject,
    html,
  };
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  // Honeypot: bots fill the hidden field; answer as if it worked and send nothing.
  if (body && typeof body.company_fax === 'string' && body.company_fax.trim() !== '') {
    return json({ success: true }, 200);
  }

  const { lead, error } = validateLead(body);
  if (error) return json({ error }, 400);

  const key = context.env && context.env.RESEND_API_KEY;
  if (!key) {
    console.error('contact: RESEND_API_KEY is not set for this environment');
    return json({ error: 'email_not_configured' }, 500);
  }

  const host = new URL(context.request.url).hostname;
  const email = buildEmail(lead, { preview: !PRODUCTION_HOSTS.has(host) });

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify(email),
    });
    if (!res.ok) {
      console.error('contact: Resend rejected the email', res.status, await res.text());
      return json({ error: 'email_failed' }, 500);
    }
  } catch (e) {
    console.error('contact: Resend request failed', e);
    return json({ error: 'email_failed' }, 500);
  }

  return json({ success: true }, 200);
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://clicroot.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
