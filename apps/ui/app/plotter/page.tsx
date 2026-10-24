import { SiteFooter } from "@coss/ui/shared/site-footer";
import type { Metadata } from "next";
import { Suspense } from "react";
import { IllustrationGallery } from "./illustration-gallery";
import { illustrations } from "./illustrations";

export const metadata: Metadata = {
  title: "Plotter illustrations – coss ui",
  description:
    "A collection of monochrome illustrations exploring geometry, interfaces, and the systems behind familiar things.",
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
            exploring geometry, interfaces, and the systems behind familiar
            things.
          </p>
        </header>
        <Suspense
          fallback={
            <p className="py-8 text-muted-foreground">Loading illustrations…</p>
          }
        >
          <IllustrationGallery illustrations={illustrations} />
        </Suspense>
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
