# coss.com product concepts

Source review: 25 October 2026. Scope: two replacement local concepts in `/ui/plotter#coss-concepts`. These are proposals for review; do not publish, push, or deploy them to coss.com.
These are conceptual product diagrams. They do not claim to be infrastructure topology, standardized
electrical symbols, physical parts, performance charts or implementation availability badges.

## Evidence and claim boundary

- The [live homepage](https://coss.com/) presents Email, SMS, Video and Scheduling behind one SDK and
  one key, with a common operational contract. Its catalog is retained without new API or availability
  claims. The cosscom/coss repository’s `apps/site/src/components/home/parts.ts` supplies the same four entries.
- [SDK overview](https://coss.com/docs/sdk) and
  `content/docs/(tools)/sdk/index.mdx`: one client is created with an API key and reused across products.
- [Sending email](https://coss.com/docs/email/sending),
  [delivery events](https://coss.com/docs/email/delivery), and the corresponding local MDX explain an
  accepted send followed by delivery reporting for individual recipients. The return line is an event,
  not a promise that every recipient receives or opens the email.
- [SMS](https://coss.com/docs/sms) and `content/docs/sms/index.mdx` describe sending to a carrier and
  following its reported outcome through the same key, webhooks and logs. The drawing does not promise
  delivery, depict a guaranteed latency or claim the return is an SMS sent to the recipient.
- [The public documentation index](https://coss.com/llms.txt) covers implemented Email, SMS, Hooks and
  Risk; it is not identical to the homepage's four-product presentation. Video and Scheduling therefore
  remain conceptual room/availability illustrations of the existing marketing descriptions. No method,
  status, quota, recording pipeline or synchronization behavior is invented for them.

Live text and the checked-out primary MDX were read before implementation. Some live `.md` fetches
were unavailable in the research tool; their checked-out source supplied the detailed behavior evidence.

## Visual direction and rejection

The user rejected the first X01–X07 set for poor quality relative to the established illustrations. The bus, service pictograms, and separate/shared-container comparison are superseded. Their scoped product research remains useful; their geometry checks do not establish visual acceptance.

The new pair starts from complementary geometry rather than a catalog of icons:

| Drawing | Construction → product meaning | What it leaves out |
| --- | --- | --- |
| X01 · One interface, many services | Four planar pieces register to one circular opening → different catalog services meet one SDK contract | Physical parts, actual network topology, API availability or authorization guarantees |
| X07 · A common boundary | Two complementary regions share one continuous curved boundary → an app and coss meet through a common interface | Transport, request flow, timings, deployment topology or provider implementation |

P00 supplies the hierarchy of silhouette, generators, grid, and measurements. B03/B04 establish how a service idea can live in a construction relationship. Neither proposal has been approved as a reference. Components live under `app/plotter/coss-concepts` and are shown only in the local Plotter showcase.

## Geometry and review limits

The X07 square is 240 units wide; its two generating circles have equal radius 60 and centers 120 apart. Their complementary semicircles form a shared S-profile with one path owner. The labels `4u`, `2u`, and `r = u` use `u = 60`. These are drawing units, not product dimensions.

Geometry and browser review are recorded against specific revisions in the [source audit](source-audit.md). Product meaning, geometric consistency, and visual acceptance remain separate. Do not promote the new concepts into the approved reference set without explicit user selection.
