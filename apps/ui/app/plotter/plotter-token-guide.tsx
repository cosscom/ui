"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Button } from "@/registry/default/ui/button";
import standard from "../../skills/plotter/assets/foundation/standard.json";

const controls = [
  {
    token: "--plotter-stroke-primary",
    label: "Primary stroke",
    hint: "The outlines of the carriers and cores.",
    max: standard.tokens["--plotter-stroke-primary"] * 2,
  },
  {
    token: "--plotter-opacity-guide",
    label: "Guide opacity",
    hint: "The quiet alignment and extension lines.",
    max: 1,
  },
  {
    token: "--plotter-opacity-hatch",
    label: "Hatch opacity",
    hint: "Only the diagonal lines on the core faces.",
    max: 1,
  },
] as const;

type ControlToken = (typeof controls)[number]["token"];
type Values = Record<ControlToken, number>;

const defaults: Values = {
  "--plotter-stroke-primary": standard.tokens["--plotter-stroke-primary"],
  "--plotter-opacity-guide": standard.tokens["--plotter-opacity-guide"],
  "--plotter-opacity-hatch": standard.tokens["--plotter-opacity-hatch"],
};

export function PlotterTokenGuide({ children }: { children: ReactNode }) {
  const id = useId();
  const cssRef = useRef<HTMLTextAreaElement>(null);
  const [values, setValues] = useState<Values>(defaults);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">(
    "idle",
  );
  const css = `.illustration {\n  --plotter-ink: currentColor;\n${controls
    .map(({ token }) => `  ${token}: ${values[token]};`)
    .join("\n")}\n}`;
  const previewStyle: CSSProperties & Values = values;

  useEffect(() => {
    if (copyState !== "copied") return;
    const timeout = window.setTimeout(() => setCopyState("idle"), 1600);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(css);
      setCopyState("copied");
    } catch {
      cssRef.current?.focus();
      cssRef.current?.select();
      setCopyState("manual");
    }
  }

  return (
    <section
      aria-labelledby="plotter-tokens-heading"
      className="scroll-mt-20 border-t py-12 md:py-16"
      id="plotter-tokens"
    >
      <div className="mb-8 flex max-w-2xl flex-col gap-3">
        <h2
          className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
          id="plotter-tokens-heading"
        >
          Make it fit your page
        </h2>
        <p className="text-pretty text-muted-foreground text-sm">
          Adjust ink, stroke widths, and opacity without changing the drawing.
          Try the shared tokens on W05, then copy the CSS to a wrapper around
          your inline SVG.
        </p>
      </div>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:items-center xl:gap-12">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-5">
            {controls.map(({ token, label, hint, max }) => (
              <div className="flex flex-col gap-2" key={token}>
                <div className="flex items-baseline justify-between gap-4">
                  <label
                    className="font-medium text-sm"
                    htmlFor={`${id}-${token}`}
                  >
                    {label}
                  </label>
                  <output
                    className="font-mono text-muted-foreground text-xs tabular-nums"
                    htmlFor={`${id}-${token}`}
                  >
                    {values[token].toFixed(2)}
                  </output>
                </div>
                <input
                  aria-describedby={`${id}-${token}-hint`}
                  className="h-6 w-full cursor-pointer accent-foreground outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                  id={`${id}-${token}`}
                  max={max}
                  min={0}
                  onChange={(event) => {
                    const value = event.currentTarget.valueAsNumber;
                    setValues((current) => ({
                      ...current,
                      [token]: value,
                    }));
                    setCopyState("idle");
                  }}
                  step={0.01}
                  type="range"
                  value={values[token]}
                />
                <p
                  className="text-muted-foreground text-xs"
                  id={`${id}-${token}-hint`}
                >
                  {hint}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                className="text-muted-foreground text-xs"
                htmlFor={`${id}-css`}
              >
                CSS for your inline drawing
              </label>
              <div className="flex gap-1">
                <Button
                  onClick={() => {
                    setValues(defaults);
                    setCopyState("idle");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Reset
                </Button>
                <Button onClick={copyCss} size="sm" variant="outline">
                  {copyState === "copied" ? "Copied" : "Copy CSS"}
                </Button>
              </div>
            </div>
            <textarea
              className="w-full resize-none rounded-lg border bg-muted/40 p-4 font-mono text-xs leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id={`${id}-css`}
              readOnly
              ref={cssRef}
              rows={6}
              spellCheck={false}
              value={css}
            />
            <p
              aria-live="polite"
              className="min-h-4 text-muted-foreground text-xs"
            >
              {copyState === "manual"
                ? "Clipboard unavailable. The CSS is selected; copy it manually."
                : copyState === "copied"
                  ? "CSS copied to clipboard."
                  : "The starting values come from Plotter’s shared standard."}
            </p>
          </div>
        </div>

        <figure className="min-w-0">
          <div
            aria-label="Assembly line with adjustable drawing tokens"
            className="overflow-x-auto rounded-lg border bg-sidebar p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            role="img"
            style={previewStyle}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: Native-size drawings need keyboard scrolling on narrow screens.
            tabIndex={0}
          >
            <div className="pointer-events-none mx-auto w-[560px] select-none">
              {children}
            </div>
          </div>
          <figcaption className="mt-3 text-muted-foreground text-xs">
            W05 · Same geometry, adjustable linework. Scroll sideways on narrow
            screens.
          </figcaption>
        </figure>
      </div>

      <details className="mt-8 rounded-lg border p-4 sm:p-5">
        <summary className="cursor-pointer font-medium text-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
          All supported tokens and how to use them
        </summary>
        <div className="mt-5 grid min-w-0 gap-6 xl:grid-cols-2 xl:gap-10">
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full text-start text-xs">
              <caption className="sr-only">Plotter token defaults</caption>
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="pb-3 text-start font-medium" scope="col">
                    Token
                  </th>
                  <th className="pb-3 text-end font-medium" scope="col">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2.5 pe-4 font-mono">--plotter-ink</td>
                  <td className="py-2.5 text-end font-mono">currentColor</td>
                </tr>
                {Object.entries(standard.tokens).map(([token, value]) => (
                  <tr key={token}>
                    <td className="py-2.5 pe-4 font-mono">{token}</td>
                    <td className="py-2.5 text-end font-mono tabular-nums">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex min-w-0 flex-col gap-4 text-pretty text-muted-foreground text-sm">
            <p>
              Ink accepts a CSS color. Stroke widths are non-negative, unitless
              SVG values; opacity ranges from 0 to 1. Preserve the relative
              emphasis of forms, guides, and hatching.
            </p>
            <p>
              These variables apply to inline SVG with the packaged role
              stylesheet, a <code>data-plotter</code> root, and named{" "}
              <code>data-plotter-role</code> marks. In this catalogue, AG01 and
              W05 use that foundation. Other drawings keep their existing
              styles. CSS on a page cannot reach into an SVG loaded as an image.
            </p>
            <p>
              Start with{" "}
              <code className="break-all">
                assets/examples/registration.svg
              </code>{" "}
              in the skill ZIP. It already embeds the role stylesheet. Paste its
              SVG markup inside your <code>.illustration</code> wrapper. To
              inherit your page’s ink, remove that source SVG’s fixed{" "}
              <code>color</code> style, or set <code>--plotter-ink</code> to an
              explicit theme color such as <code>var(--foreground)</code>.
            </p>
            <p>
              Dash patterns, hatch spacing, and arrow geometry express meaning.
              They belong to the shared standard and helpers, rather than CSS
              customization. See the{" "}
              <a
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="#visual-grammar"
              >
                visual grammar
              </a>{" "}
              to choose the right mark.
            </p>
            <p>
              For a resolved SVG export, pass your choices to the packaged
              exporter with <code>--ink</code> and{" "}
              <code className="break-all">{`--token=--plotter-opacity-guide=${standard.tokens["--plotter-opacity-guide"]}`}</code>
              . It cannot read a detached page’s CSS. The{" "}
              <a
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                href="#plotter-outputs"
              >
                downloadable SVGs
              </a>{" "}
              already contain resolved appearance values.
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
