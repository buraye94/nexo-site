// PostHog configuration (specs/posthog-rollout in the consulting repo).
// The project token is public by design; set PUBLIC_POSTHOG_KEY in the Cloudflare Pages
// environment. Without it, no analytics script, banner or cookie preferences link renders.
export const posthogKey: string = (import.meta.env.PUBLIC_POSTHOG_KEY ?? '').trim();
export const posthogEnabled = posthogKey.startsWith('phc_');
export const posthogHost = 'https://us.i.posthog.com';
