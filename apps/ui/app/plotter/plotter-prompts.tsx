"use client";

import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";
import {
  animationPrompt,
  drawingPrompt,
  plotterDownload,
} from "./plotter-usage-content";

function Prompt({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-5">
      <p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed">
        {text}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={copy} size="sm" variant="outline">
          {status === "copied" ? (
            <CheckIcon aria-hidden="true" />
          ) : (
            <CopyIcon aria-hidden="true" />
          )}
          {status === "copied" ? "Copied" : "Copy prompt"}
        </Button>
        <span aria-live="polite" className="text-muted-foreground text-xs">
          {status === "failed"
            ? "Select the prompt text and copy it manually."
            : status === "copied"
              ? "Ready to paste into your agent."
              : "Adapt the subject and placement to your brief."}
        </span>
      </div>
    </div>
  );
}

export function PlotterPrompts({
  drawing,
  animation,
}: {
  drawing: ReactNode;
  animation: ReactNode;
}) {
  return (
    <div className="flex scroll-mt-20 flex-col gap-6" id="plotter-outputs">
      <Tabs defaultValue="drawing" className="gap-6">
        <TabsList aria-label="Choose a Plotter workflow">
          <TabsTab value="drawing">Draw an illustration</TabsTab>
          <TabsTab value="animation">Animate a drawing</TabsTab>
        </TabsList>
        <TabsPanel value="drawing">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:items-start">
            <div className="flex min-w-0 flex-col gap-4">
              <h3 className="font-medium text-lg">
                Start with one relationship.
              </h3>
              <p className="text-pretty text-muted-foreground text-sm">
                Give your agent a subject, a placement, and an output format.
                Plotter supplies the construction references and drawing
                workflow.
              </p>
              <Prompt text={drawingPrompt} />
              <p className="text-muted-foreground text-xs">
                Looking for a direction? Browse the{" "}
                <a
                  className="underline underline-offset-4"
                  href="#illustrations"
                >
                  catalogue
                </a>
                , then use the{" "}
                <a
                  className="underline underline-offset-4"
                  href="#visual-grammar"
                >
                  visual grammar
                </a>{" "}
                to choose supporting marks.
              </p>
            </div>
            <figure className="flex min-w-0 flex-col gap-4">
              <div
                aria-label="Agent registration, editable SVG example"
                className="overflow-x-auto rounded-lg border bg-sidebar p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="img"
                // biome-ignore lint/a11y/noNoninteractiveTabindex: Native-size drawings need keyboard scrolling on narrow screens.
                tabIndex={0}
              >
                <div className="mx-auto w-[560px]">{drawing}</div>
              </div>
              <figcaption className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">
                    Agent registration{" "}
                    <span className="ms-2 font-mono text-muted-foreground text-xs">
                      AG01
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Editable paths and labels · Self-contained SVG
                  </p>
                </div>
                <Button
                  render={
                    <a
                      download="agent-registration.svg"
                      href={plotterDownload("agent-registration.svg")}
                    />
                  }
                  size="sm"
                  variant="outline"
                >
                  <DownloadIcon aria-hidden="true" />
                  Download SVG
                </Button>
              </figcaption>
            </figure>
          </div>
        </TabsPanel>
        <TabsPanel value="animation">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:items-start">
            <div className="flex min-w-0 flex-col gap-4">
              <h3 className="font-medium text-lg">
                Give the drawing a reason to move.
              </h3>
              <p className="text-pretty text-muted-foreground text-sm">
                Start from an editable still.{" "}
                <a
                  className="underline underline-offset-4"
                  download="production-chain.svg"
                  href={plotterDownload("production-chain.svg")}
                >
                  Download the assembly-line SVG
                </a>{" "}
                and attach it with this prompt.
              </p>
              <Prompt text={animationPrompt} />
              <p className="text-muted-foreground text-xs">
                One skill, a separate motion workflow. Explore more{" "}
                <a className="underline underline-offset-4" href="#animations">
                  animation examples
                </a>
                .
              </p>
            </div>
            <figure className="flex min-w-0 flex-col gap-4">
              <div
                aria-label="Assembly line, editable animation example"
                className="overflow-x-auto rounded-lg border bg-sidebar outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="region"
                // biome-ignore lint/a11y/noNoninteractiveTabindex: Native-size drawings need keyboard scrolling on narrow screens.
                tabIndex={0}
              >
                <div className="mx-auto w-[560px]">{animation}</div>
              </div>
              <figcaption className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">
                    An assembly line{" "}
                    <span className="ms-2 font-mono text-muted-foreground text-xs">
                      W05
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Editable SVG + player · Open the HTML in a browser
                  </p>
                </div>
                <Button
                  render={
                    <a
                      download="assembly-line.html"
                      href={plotterDownload("assembly-line.html")}
                    />
                  }
                  size="sm"
                  variant="outline"
                >
                  <DownloadIcon aria-hidden="true" />
                  Download HTML
                </Button>
              </figcaption>
            </figure>
          </div>
        </TabsPanel>
      </Tabs>
      <p className="text-muted-foreground text-xs sm:hidden">
        Scroll sideways to see the full drawing.
      </p>
      <p className="text-muted-foreground text-xs">
        These are editable examples to study and adapt. Downloads need no coss
        runtime. Labels use Cal Sans when available, with a sans-serif fallback.
      </p>
    </div>
  );
}
