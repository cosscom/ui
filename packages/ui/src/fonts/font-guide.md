# Good typography with Cal Sans: v2

A friendly guide to Cal Sans for everyone who makes things with it: which font to pick, how to make it look good, and where to get it. No code needed to start.

Mark Davis · WORDMARK × Cal.com · October 2026 · [github.com/calcom/sans](https://github.com/calcom/sans)

---

## Contents

1. [Our fonts](#part-1-our-fonts)
2. [Good typography (quickstart)](#part-2-good-typography-quickstart)
3. [Type deployment](#part-3-type-deployment)

---

## Part 1: Our fonts

Two families, **Cal Sans** and **Cal Sans Text UI**: which one at which size, and how they pair. Sixteen files, no sliders needed (Cal Sans Essentials).

| Family | Use for | Files |
| --- | --- | --- |
| **Cal Sans** | Headlines, 24px and up | `CalSans-Regular.ttf`, `CalSans-Italic.ttf`, `CalSans-Medium.ttf`, `CalSans-MediumItalic.ttf`, `CalSans-SemiBold.ttf`, `CalSans-SemiBoldItalic.ttf`, `CalSans-Bold.ttf`, `CalSans-BoldItalic.ttf` |
| **Cal Sans Text UI** | Everything under 20px | `CalSansTextUI-Regular.ttf`, `CalSansTextUI-Italic.ttf`, `CalSansTextUI-Medium.ttf`, `CalSansTextUI-MediumItalic.ttf`, `CalSansTextUI-SemiBold.ttf`, `CalSansTextUI-SemiBoldItalic.ttf`, `CalSansTextUI-Bold.ttf`, `CalSansTextUI-BoldItalic.ttf` |

### Type usage: big is Cal Sans, small is Text UI

| Style | Example | Font · size/line height |
| --- | --- | --- |
| h1 | The better way to schedule | CalSans-Bold · 64/100% |
| h2 | The better way to schedule your meetings | CalSans-Bold · 40/110% |
| h3 | The better way to schedule your meetings | CalSans-Bold · 32/110% |
| h4 | The better way to schedule your meetings | CalSans-Bold · 24/125% |
| eyebrow | THE BETTER WAY TO SCHEDULE | CalSansTextUI-SemiBold · 14/100% |
| body / lg | A fully customizable scheduling experience for individuals and teams. | CalSansTextUI-Regular · 20/150% |
| body / md | A fully customizable scheduling experience for individuals, businesses taking calls and developers. | CalSansTextUI-Regular · 16/150% |
| body / sm | A fully customizable scheduling experience for individuals, businesses taking calls and developers building platforms. | CalSansTextUI-Regular · 14/150% |
| button | Book a call | CalSansTextUI-SemiBold · 16/100% |
| caption | Mon–Fri, 9:15 AM–6:00 PM · GMT−4 | CalSansTextUI-Medium · 12/140% |

**No letter-spacing anywhere, caps included.**

### Pairing: the small line is Text UI too

- **Don't** use Inter or Matter for small text. Two sans families in one block have different a, g, terminals and spacing, so it reads as two brands.
- **Do** use Cal Sans Text UI for small text. One design at two sizes: Text UI is Cal Sans redrawn to read small.

### Pairing: and the big line is Cal Sans

- **Don't** use Cal Sans Text UI as a heading. Text UI is spaced and shaped to read at 10–20px. Blown up, it goes loose and generic, and the headline loses the Cal Sans voice.
- **Do** use Cal Sans for the heading: tight, single-story a, the shapes people know as Cal. Text UI stays for the small line.

Headline: `CalSans-Bold` · small line: `CalSansTextUI-Regular`.

---

## Part 2: Good typography (quickstart)

How the versions got here, where to get them, the short list of rules, real punctuation, and how to spot the 2021 file.

### How we got here: two lines, one family

| | 2021 | 2025 | Early 2026 | Sept–Oct 2026 |
| --- | --- | --- | --- | --- |
| **Display** | Cal Sans v1.000: one bold display style for the headline. calcom/font, then Google Fonts. | Still the headline face | Still on Google Fonts, Framer | **Cal Sans v2.011**: one six-axis variable font in calcom/sans. Display replaces v1.000 (opsz 45, GEOM 50, Bold). |
| **UI** | Inter/Matter | Cal Sans UI 1.5: Light–Bold, MODE axis. calcom/sans-ui. | Cal Sans UI 1.6: scaled to Inter, GEOM axis. npm `@calcom/cal-sans-ui`. | **Cal Sans v2.011**: both lines merge on opsz. Text UI replaces UI 1.6 (opsz 10, GEOM 25, 400–700). |

`calcom/sans-ui` is being deprecated; `calcom/sans` is the one home now.

### Where to get Cal Sans

- **npm `cal-sans` (recommended):** `npm install cal-sans`. v2.011, all six axes, drawn italic, full glyph set with every `ss` and `cv` feature.
- **Cal Sans Essentials (no sliders):** download `calsans-static-essentials`. 16 TTFs: CalSans and CalSansTextUI, Regular to Bold with italics. For Figma, Keynote, Slides and Canva.
- **Everything else: [calcom/sans](https://github.com/calcom/sans).** Variable, static and webfonts, OFL. Product UI in Figma: `calsans-cossui`.

| Feature | npm | Google Fonts | .zip |
| --- | --- | --- | --- |
| `ss` and `cv` features | Yes | No, subset out | Yes |
| Six axes and drawn italic | Yes | No, v1 today | Yes |
| Next.js / bundler import | Yes | Partial | Manual |
| Updates | `npm update` | Google's schedule | Manual |
| Self-hosted, no CDN | Yes | No | Yes |

**Deprecated for now**

- Google Fonts, Fontsource: v1.000 only, for now.
- Framer's Cal Sans menu: v1; upload v2 as a custom font.
- `calcom/sans-ui`, npm `@calcom/cal-sans-ui`: retiring; use `cal-sans`.

### Rules: good typography, the short list

1. **No fake bold or italic.** v1 has one style, so the browser smears it. v2 ships as several builds: load every file of the one you pick, so italic finds the drawn italic. Add `font-synthesis: none` to catch a gap.
2. **Small text is Cal Sans Text UI.** Do: Cal Sans Text UI for anything under about 20px. Don't: Inter or Matter for small, or the 2021 file.
3. **Leave the tracking alone.** Spacing is drawn into each optical size: Text sets about 15% wider than Display, Micro about 18%. Don't add letter-spacing, in or out.
4. **One GEOM per role.** 25 for product, 50 for brand, 0 for codes and IDs. Mixing forms in one line reads as a mistake.

### Punctuation: typeset it, don't type it

| Typed | Typeset | Name | Character | Code |
| --- | --- | --- | --- | --- |
| `I'm` | I’m | Apostrophe | ’ | U+2019 |
| `-3%` | −3% | Minus | − | U+2212 |
| `9-5` | 9–5 | En dash, ranges | – | U+2013 |
| `"Hi"` | “Hi” | Curly quotes | “ ” | U+201C / U+201D |

Did you know? The true minus (−12.5%) is drawn the same width as the plus (+12.5%), so signs line up in a right-aligned column. A hyphen (-12.5%) falls short, even with tabular figures.

| Typed | Typeset |
| --- | --- |
| Mon - Tue, 9:15 AM - 7:00 PM | Mon–Tue, 9:15 AM–7:00 PM |
| 10:00am - 10:20am | 10:00–10:20am |
| 1-1 of 1 · GMT-4 | 1–1 of 1 · GMT−4 |

The hyphen `-` only joins words. Never use it for minus or ranges.

### In product: small strings, set properly

| Where | Character | Example |
| --- | --- | --- |
| Event headline (contractions) | ’ apostrophe | I’m hosting Tennis on Mon, Sep 21 at 16:00 |
| Booking (time ranges and testimonial quotes) | – en dash · “ ” quotes | Mon, 12 Oct · 10:00–10:20am<br>“Hello, we’re looking for a designer…” |
| Working hours (day and time ranges) | – en dash | Sun, 12:00–4:00 PM<br>Mon–Tue, 9:15 AM–7:00 PM<br>Wed–Fri, 9:15 AM–6:00 PM |
| Time zone (negative UTC offsets) | − minus | America/New York GMT−4<br>America/La Paz GMT−4<br>Europe/Berlin GMT+2 |

Set once at the source: range formatters, offset labels, i18n templates.

### How to spot old Cal Sans (2021 · v1.000)

It's the file Google Fonts serves, and the "Cal Sans" Framer loads for you natively. The tells:

- One weight only; ask for Regular and you get this.
- Figures fit so tight that 2, 4, 5 and 7 nearly touch.
- Small, low `<` `>` that read as chevrons.
- No italic, no axes in the font menu.
- Pointed apexes and joins on A N V M W Z and 2 4 5 7.

### The same letters in v2 (2026 · v2.011)

Cal Sans v2 Bold, same size, same baselines. What changed:

- Four weights, Regular to Bold, plus drawn italics.
- Figures spaced so 2, 4, 5 and 7 breathe.
- Larger `<` `>` drawn as real operators.
- One variable font with six axes.
- Corners blunt by default; SHRP brings the points back.

### 2021 → 2026: same drawing, respaced, with the points on a dial

- The 2021 style is now Bold in a 400–700 range.
- Wider letterfit; M and figures open up.
- `<` `>` drawn as real operators, not chevrons.
- SHRP 100 restores pointed apexes.

---

## Part 3: Type deployment

Which build you're running, the two lines of CSS, picking a build, recipes, and the six axes in detail.

### Start here: which Cal Sans are you running?

| Where you got it | Version | What you get |
| --- | --- | --- |
| Google Fonts / Fontsource | v1.000 (2021) | One bold display style, labeled 400 Regular; no axes, no italic |
| npm `cal-sans` · calcom/sans | v2 (2.1.0) | Six-axis variable font, real italics, 400 to 700 |
| npm `@calcom/cal-sans-ui` (deprecated) | Text UI cut | opsz pinned at the 10pt drawing, other axes live |
| Google Fonts, coming | Cal Sans v2 / Cal Sans Text UI | v2 without the `ss` and `cv` features. Text UI: wght only; opsz 10, GEOM 25, YTAS 1520 baked in |

If your CSS loads `fonts.googleapis.com/css2?family=Cal+Sans`, you have the 2021 file, and none of v2 reaches your site yet.

Sources: google/fonts `ofl/calsans` (Version 1.000), npm registry, calcom/sans `fonts/README.md`.

### Moving off Google Fonts: two lines of CSS is the whole integration

Before (v1.000, one style):

```html
<link href="https://fonts.googleapis.com/css2?family=Cal+Sans" rel="stylesheet">
```

After (v2, six axes):

```bash
npm install cal-sans
```

```css
@import "cal-sans";

body {
  font-family: "Cal Sans";
  font-optical-sizing: auto;
}
```

Remove the Google link first. v1 and v2 share the family name "Cal Sans", so a page that loads both may pick the wrong one.

### Pick one build: same drawings, different files

| Build | Files | opsz | Italic | Use for |
| --- | --- | --- | --- | --- |
| `var-full` · npm `cal-sans` | 1 variable | 8–45 | `ital` axis | Websites; keeps `ss` and `cv` features |
| `cossui` | 2 variable | 8–32 | Separate file | Cal.com product, COSS UI, Framer |
| `gf-api` | 2 variable | 8–48 | Separate file | Google Fonts, coming |
| `gf-api-textui` | 2 variable | fixed 10 | Separate file | Cal Sans Text UI: wght only |

The display drawing answers to 45, 32 or 48 depending on the build. Never hard-code opsz; let `font-optical-sizing: auto` map it. And load both files of a two-file build, or italics come out slanted, not drawn.

Source: calcom/sans `fonts/README.md`.

### Recipes: four settings cover almost everything

| Role | `font-weight` | `font-variation-settings` |
| --- | --- | --- |
| Hero, like 2021 | 700 | `"GEOM" 50` |
| Sharp display | 700 | `"GEOM" 50, "SHRP" 80` |
| Body and UI | 400 | `"GEOM" 25` |
| Codes and IDs | 400 | `"GEOM" 0` |

No opsz in any recipe: with `font-optical-sizing: auto` the size picks the drawing, on every build. Weight goes in `font-weight` so bold and `font-synthesis` behave.

```css
.hero      { font-weight: 700; font-variation-settings: "GEOM" 50; }
.display   { font-weight: 700; font-variation-settings: "GEOM" 50, "SHRP" 80; }
.body      { font-weight: 400; font-variation-settings: "GEOM" 25; }
.code-id   { font-weight: 400; font-variation-settings: "GEOM" 0; }
```

### The six axes

| Axis | What it does | Range · default |
| --- | --- | --- |
| `opsz` | Optical size: the size it's drawn for | 8–45 · default 14 |
| `GEOM` | Geometric form: swaps glyphs, like the a (two-story at 25, single-story at 50) | 0–100 · default 25 |
| `wght` | Weight, Regular to Bold | 400–700 · default 400 |
| `YTAS` | Ascender height: l can clear the I | 1440–1600 · default 1440 |
| `SHRP` | Corner sharpness, tuned per size | 0–100 · default 0 |
| `ital` | A real italic, drawn at 9.5° | 0–1 · default 0 |

#### 1 · opsz: small text gets its own drawing

| Tier | Use at | opsz |
| --- | --- | --- |
| Micro | under 10px | 8 |
| Text | 10–20px | 10–14 |
| Display | 24px and up | 45 |

Smaller sizes set wider and open up. Leave `font-optical-sizing: auto` on and the browser picks it.

#### 2 · GEOM: one axis, four personalities

| GEOM | What you get |
| --- | --- |
| 0 | A11y: I, l and 1 never confused |
| 25 | UI: the default, built for product |
| 50 | Base: the original drawings |
| 100 | Geo: fully geometric forms |

Glyphs swap at set points, so the single-story a arrives from 35 up. Pick a value; don't animate through it.

#### Putting axes together: eight looks from one file

Text or Display (opsz 10 or 45), UI or Geo (GEOM 25 or 100), blunt or Sharp (SHRP 0 or 100). Same word, same weight. Choose one combination per role and stick to it.

### Cal Sans UI 1.5 / 1.6 → Text UI v2.011: what changed

| Area | UI 1.5 | UI 1.6 | Text UI v2.011 |
| --- | --- | --- | --- |
| Home | calcom/sans-ui | calcom/sans-ui | Cal Sans v2, opsz pinned at 10 |
| Weights | Light–Bold, 300–700 | Regular–Bold, 400–700, lighter Regular | Regular–Bold, 400–700, plus a real italic |
| Proportions | Original cap and x-height, as Cal Sans 1.0 | Caps +3%, lowercase +5%: scaled to be interoperable with Inter | Same as 1.6 (x-height 71.5% of cap height) |
| Line box | Original metrics | Vertical metrics raised | Centered on the caps within 0.02 em |
| Ascenders | Baked to match caps | Baked to match caps | YTAS (ascender height) axis, 1440–1600; Google cut fixed at 1520 |
| Corners | Mixed: blunt vertical, sharp diagonal and horizontal | Mixed: blunt vertical, sharp diagonal and horizontal | Blunt by default, SHRP axis |
| Legibility | MODE axis 0–1 | GEOM axis 0–100: UI at 0, Text at 50, Geo at 100 | GEOM 25 became UI; 0 is A11y, 50 Base, 100 Geo; better Vietnamese |

### Legibility: when I, l and 1 can't be confused

GEOM 25 is the UI default; GEOM 0 is A11y. Use A11y for codes, IDs, passwords and anywhere a reader can't guess from context.

### Built for buttons: drops in where the system font was

At 14px, Text UI sits on the same cap height and x-height grid as Segoe UI, SF Pro, Inter, Geist and Roboto. Swap the family; your buttons, badges and line heights stay put.

---

## Ship with it

Show me what you make. Send me the bugs. ♡

[github.com/calcom/sans](https://github.com/calcom/sans) · Mark Davis · WORDMARK
