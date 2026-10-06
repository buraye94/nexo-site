// Stand-in for PostHog's array.js in browser tests: records calls, never sends data.
(function () {
  var stub = window.posthog;
  var call = (stub && stub._i && stub._i[0]) || [];
  var cfg = call[1] || {};
  var status = localStorage.getItem('ph_fake_consent') || 'pending';
  var ph = {
    __loaded: true,
    captured: [],
    config: cfg,
    get_explicit_consent_status: function () { return status; },
    opt_in_capturing: function () { status = 'granted'; localStorage.setItem('ph_fake_consent', 'granted'); },
    opt_out_capturing: function () { status = 'denied'; localStorage.setItem('ph_fake_consent', 'denied'); },
    clear_opt_in_out_capturing: function () { status = 'pending'; localStorage.removeItem('ph_fake_consent'); },
    capture: function (name, props) { ph.captured.push([name, props]); },
  };
  window.posthog = ph;
  if (typeof cfg.loaded === 'function') cfg.loaded(ph);
})();
