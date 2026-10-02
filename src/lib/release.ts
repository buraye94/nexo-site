// Placeholder content (illustrative proof, mock dashboard, artifact and photo slots,
// unconfirmed timings) renders only on preview builds. Production never shows it.
// Fail-safe: unless a build is explicitly a preview, placeholders are hidden.
//   Cloudflare Pages preview branch  -> CF_PAGES_BRANCH set and not "main" -> shown
//   Cloudflare Pages production      -> CF_PAGES_BRANCH === "main"         -> hidden
//   Local                            -> hidden, unless SHOW_PENDING=1
const branch = process.env.CF_PAGES_BRANCH;

export const showPending = process.env.SHOW_PENDING === '1' || (Boolean(branch) && branch !== 'main');
