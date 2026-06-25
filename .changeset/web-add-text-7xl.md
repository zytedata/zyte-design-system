---
"@zytedata/ds-web": minor
---

Add `typography.size.7xl` (68px) display tier for the hero/H1, and reconcile `design.md` so the prose, the primitive tables and `foundations.ts` all agree:

- Consolidated component specs into a single **Primitive Style Rules** section (buttons, typography, pills/badges, surfaces, form controls, atoms, navigation).
- Unified the primary CTA to `primary.500` (fuchsia) and removed legacy phantom tokens (`accentPrimary`/`accentSecondary`/`accentSecondaryOnDark`) that did not exist in foundations.
- Fixed the radius guidance (removed "12px everywhere" in favour of the real `radius` scale), the card border (`0.5px solid neutral.200`), and heading sizes (H1 `7xl` 68 / H2 `5xl` 48).
- Mapped Section Backgrounds and Page Metrics to tokens (`surfaceLight.*`, `secondary.800`, `primary.50`, `spacing.*`); section-number eyebrows now use `primary.500`.
