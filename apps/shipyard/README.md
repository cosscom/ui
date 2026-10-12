# shipyard

Shipyard's website and docs at [coss.com/shipyard](https://coss.com/shipyard):
the landing page, and the docs at `/shipyard/docs` on the same Fumadocs setup
as coss ui's.

- `app/page.tsx`, `app/landing.css`: the landing page, as it was at
  berthd.app. The harbour at the top is dithered on a canvas and comes alive
  at night (`public/assets/harbour.js`, `hero-loop.js`); the chapters' loops
  and line scenes load once the page has painted (`clips.js`,
  `scenes.css`/`scenes.json`). `components/landing/runtime.tsx` brings them
  in. The page keeps its own type (Inter, JetBrains Mono, in `fonts/`) and
  tokens; the header, the rails and the docs are coss's.
- `content/docs/`: the docs, moved here from the `cosscom/shipyard`
  repository's `docs/` folder. `components/docs/` are its own pieces
  (callouts, the stage, the path of cards, screenshots in `public/shots/`,
  diagrams and the line scenes); `lib/rehype-reference.ts` makes the
  reference tables linkable.
- The app's downloads, the live demo (`berthd.app/demo/`), the box's
  install line (`berthd.app/install`), the plugin listing and the
  **Review in Shipyard** bounce page stay on berthd.app: they are built and
  published from the `cosscom/shipyard` repository.

```sh
bun install
bun run dev --filter=shipyard   # http://localhost:4100/shipyard
```
