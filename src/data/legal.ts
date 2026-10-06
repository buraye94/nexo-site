// Identity of the data controller (responsable del tratamiento) for the privacy policy.
// Pending Felipe's decision (specs/posthog-rollout): Clicroot is not incorporated and the
// site shows no personal names since commit 473c740. Fill these before merging to main.
export const legal = {
  controllerName: null as string | null,
  controllerId: null as string | null,
  address: null as string | null,
  email: 'hello@clicroot.com',
  updated: '2026-10-06',
};

export const legalComplete = Boolean(legal.controllerName && legal.controllerId && legal.address);
