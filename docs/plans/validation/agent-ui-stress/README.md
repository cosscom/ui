# Agent UI stress fixture

This is a manual browser fixture, not a public example or automated test suite. It imports repository primitives and does not prove fresh consumer installation.

To reproduce from the repository root:

```sh
mkdir -p apps/ui/app/agent-ui-stress
cp docs/plans/validation/agent-ui-stress/page.tsx apps/ui/app/agent-ui-stress/page.tsx
cd apps/ui
bun run dev
```

Visit `http://localhost:4000/ui/agent-ui-stress` at 375px width. Remove the temporary route after testing; keep this source file for later checks.

The intentionally excessive German string tests unbroken content. The RTL control sets both DOM direction and Base UI DirectionProvider. No request reaches a service; feedback always rejects to exercise error presentation.

## Recorded results — 2026-09-22

- Before the fix, the feedback reason button measured 1549px wide inside a 360px dialog. Footer labels exceeded their 310px buttons (313px and 337px scroll widths).
- After the fix, the reason and both footer buttons measured 310px client/scroll width. Their heights grow to fit text; the long reason was 152px tall and footer buttons 48px tall.
- Naively combining Copy and Feedback let feedback wrap to a separate row after failure. The fixture now demonstrates the documented composition: `AgentMessageActions className="w-full items-start"` and `AgentResponseFeedback className="flex-1"`. With the error present in RTL, both roots started at the same 300px top position; feedback client/scroll width was 298px.
- No fixture primitive exceeded its client width by more than 2px in the settled RTL error state. This tolerance excludes incidental border rounding; it is not a claim about all content and viewports.
- Enter collapsed the activity disclosure; Space reopened it. Escape closed the feedback dialog and returned focus to Bad response after the exit transition.
- Disabled rating, Copy, approval, composer controls expose native disabling. Base UI disclosure triggers expose aria-disabled and data-disabled; browser automation refused activation of the disabled disclosure. Their native disabled property is false by Base UI design.
- Eight existing feedback behavioral tests passed against regenerated feedback/status source in the temporary consumer (23 assertions). Existing Base UI act warnings remain in that harness.
- App format, dependency validation, registry generation, package sync, TypeScript, and diff checks passed. Formatting reports an exports-order warning and informational notices.

## Coverage limits

These checks used the in-app browser in its existing dark theme. Reduced-motion and forced-colors emulation are not exposed by its available capabilities (visibility and viewport only); existing fallback classes remain source-reviewed, not preference-enabled browser verified. Physical touch, IME, screen-reader announcements, other browser engines, and light-theme stress coverage remain outstanding. The coding-agent usability exercise and live-provider smoke test are separate work.
