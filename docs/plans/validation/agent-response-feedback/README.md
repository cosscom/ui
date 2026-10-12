# Response feedback consumer checks

This mounted test harness targets the **installed registry output**, rather than workspace aliases. Retained here so the submission-contract checks can be reproduced after changes.

In a disposable React 19 consumer configured for coss registry installation and the `@/*` → `./src/*` alias:

1. Install `@coss/agent-response-feedback` with the shadcn CLI against the local registry.
2. Install development dependencies `happy-dom@20.8.4` and `bun-types` if not already available.
3. Copy `behavior.example.tsx` to the consumer root as `behavior.test.tsx`.
4. Run `bun test behavior.test.tsx` from that consumer.

The retained file deliberately does not use a test-runner filename. The repository-wide test command must not execute it because its React and Happy DOM dependencies belong to the disposable consumer.

The consumer also needs React DOM matching React. Tests expect generated components under `src/components/ui`. They cover async saves, clearing, controlled selection, disabling, optional negative fields, failure recovery, and pending duplicate/dismissal guards. Happy DOM can emit Base UI asynchronous `act` warnings; actual keyboard focus restoration, dialog cancellation/reset, and narrow layouts are verified separately in a browser.
