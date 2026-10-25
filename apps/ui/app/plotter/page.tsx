import { SiteFooter } from "@coss/ui/shared/site-footer";
import type { Metadata } from "next";
import { Suspense } from "react";
import { IllustrationGallery } from "./illustration-gallery";
import { illustrations } from "./illustrations";
import { PrimitivesBlueprint } from "./primitives-blueprint";
import { PrimitivesMotionPreview } from "./primitives-motion-preview";

export const metadata: Metadata = {
  title: "Plotter illustrations – coss ui",
  description:
    "A collection of monochrome illustrations and animations exploring geometry, interfaces, and the systems behind familiar things.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <main className="container w-full flex-1 [font-optical-sizing:auto] [font-synthesis:none]">
        <header className="flex flex-col gap-5 py-12 md:py-16 lg:py-20">
          <h1 className="text-balance font-bold font-heading text-[clamp(2.25rem,5vw,4rem)] leading-none [font-variation-settings:'GEOM'_50]">
            Plotter illustrations
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
            Simple forms. Fine lines. A collection of monochrome illustrations
            and animations exploring geometry, interfaces, and the systems
            behind familiar things.
          </p>
        </header>
        <section
          aria-labelledby="animations-heading"
          className="scroll-mt-16 border-t py-12 md:py-16"
          id="animations"
        >
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2
              className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
              id="animations-heading"
            >
              Animations
            </h2>
            <p className="text-muted-foreground text-xs">1 example</p>
          </div>
          <div className="grid overflow-hidden rounded-lg border border-border/64 bg-sidebar lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
              <p className="text-muted-foreground text-xs">Foundations / M01</p>
              <h3 className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]">
                Changing geometry
              </h3>
              <p className="max-w-sm text-pretty text-muted-foreground text-sm">
                Avatar, pill, switch, button, card, slider. Six familiar UI
                elements, one continuous loop, with measurements that follow the
                geometry.
              </p>
            </div>
            <div className="min-w-0 border-t lg:border-s lg:border-t-0">
              <PrimitivesMotionPreview>
                <PrimitivesBlueprint />
              </PrimitivesMotionPreview>
            </div>
          </div>
        </section>
        <section
          aria-labelledby="illustrations-heading"
          className="scroll-mt-16 border-t pt-12 md:pt-16"
          id="illustrations"
        >
          <h2
            className="mb-6 font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
            id="illustrations-heading"
          >
            Illustrations
          </h2>
          <Suspense
            fallback={
              <p className="py-8 text-muted-foreground">
                Loading illustrations…
              </p>
            }
          >
            <IllustrationGallery illustrations={illustrations} />
          </Suspense>
        </section>
        <section className="flex flex-col items-start justify-between gap-6 border-t py-12 sm:flex-row sm:items-center md:py-16">
          <div className="max-w-xl space-y-2">
            <h2 className="font-medium text-lg">Draw in the same direction.</h2>
            <p className="text-pretty text-muted-foreground text-sm">
              Plotter is also a reusable skill, with visual references and
              guidance for creating new illustrations in this style.
            </p>
          </div>
          <a
            className="shrink-0 text-sm underline underline-offset-4 hover:text-muted-foreground"
            href="https://github.com/cosscom/ui/tree/main/apps/ui/skills/plotter"
          >
            Explore the Plotter skill
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
