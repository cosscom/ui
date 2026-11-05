import { SiteFooter } from "@coss/ui/shared/site-footer";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CossConcepts } from "./coss-concepts";
import { EngineeringMotionPreview } from "./engineering-motion-preview";
import {
  NewtonsCradleStudy,
  ProductionChainStudy,
} from "./engineering-studies";
import { IllustrationGallery } from "./illustration-gallery";
import { illustrations } from "./illustrations";
import { NewtonsCradleMotionDrawing } from "./newtons-cradle-motion-drawing";
import { NotFoundMotion } from "./not-found-motion";
import { OrbitsMotionDrawing, OrbitsStudy } from "./orbits-motion-drawing";
import { ParticlesBlueprint } from "./particles-blueprint";
import { ParticlesMotion } from "./particles-motion";
import { PlotterIntro } from "./plotter-intro";
import { PlotterTokenGuide } from "./plotter-token-guide";
import { PlotterUsage } from "./plotter-usage";
import { PrimitivesBlueprint } from "./primitives-blueprint";
import { PrimitivesMotionPreview } from "./primitives-motion-preview";
import { ProductionChainMotionDrawing } from "./production-chain-motion-drawing";
import { VisualGrammar } from "./visual-grammar";

export const metadata: Metadata = {
  title: "Plotter illustrations – coss ui",
  description:
    "Draw and animate editable monochrome illustrations with Plotter. Install the skill, copy a brief, explore the catalogue, and learn the visual grammar.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <main className="container w-full flex-1 [font-optical-sizing:auto] [font-synthesis:none]">
        <PlotterIntro />
        <PlotterUsage />
        <PlotterTokenGuide>
          <ProductionChainStudy />
        </PlotterTokenGuide>
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
            <p className="text-muted-foreground text-xs">6 examples</p>
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
          <article
            aria-labelledby="particles-animation-title"
            className="mt-6 grid scroll-mt-20 overflow-hidden rounded-lg border border-border/64 bg-sidebar lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
            id="particles-animation"
          >
            <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
              <p className="text-muted-foreground text-xs">Particles / C03</p>
              <h3
                className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
                id="particles-animation-title"
              >
                Three assemblies
              </h3>
              <p className="max-w-sm text-pretty text-muted-foreground text-sm">
                Workspace, booking, activity. Three sets of independent elements
                assemble into three different interfaces in a repeating
                sequence.
              </p>
            </div>
            <div className="min-w-0 border-t lg:border-s lg:border-t-0">
              <ParticlesMotion controls="preview">
                <ParticlesBlueprint />
              </ParticlesMotion>
            </div>
          </article>
          <article
            aria-labelledby="not-found-animation-title"
            className="mt-6 grid scroll-mt-20 overflow-hidden rounded-lg border border-border/64 bg-sidebar lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
            id="not-found-animation"
          >
            <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
              <p className="text-muted-foreground text-xs">
                Empty states / M03
              </p>
              <h3
                className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
                id="not-found-animation-title"
              >
                An unreachable destination
              </h3>
              <p className="max-w-sm text-pretty text-muted-foreground text-sm">
                A request follows a curved route, reaches the closed end, and
                returns. The destination stays absent, one unit beyond its
                reach.
              </p>
            </div>
            <div className="min-w-0 border-t lg:border-s lg:border-t-0">
              <NotFoundMotion />
            </div>
          </article>
          <article
            aria-labelledby="production-chain-animation-title"
            className="mt-6 grid scroll-mt-20 overflow-hidden rounded-lg border border-border/64 bg-sidebar lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
            id="production-chain-animation"
          >
            <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
              <p className="text-muted-foreground text-xs">Systems / W05</p>
              <h3
                className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
                id="production-chain-animation-title"
              >
                An assembly line in motion
              </h3>
              <p className="max-w-sm text-pretty text-muted-foreground text-sm">
                A core lowers into its carrier. The line advances, the completed
                part moves on, and the next assembly begins.
              </p>
            </div>
            <div className="min-w-0 border-t lg:border-s lg:border-t-0">
              <EngineeringMotionPreview
                animated={<ProductionChainMotionDrawing />}
                caption="Load · Seat · Advance"
              >
                <ProductionChainStudy />
              </EngineeringMotionPreview>
            </div>
          </article>
          <article
            aria-labelledby="newtons-cradle-animation-title"
            className="mt-6 grid scroll-mt-20 overflow-hidden rounded-lg border border-border/64 bg-sidebar lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
            id="newtons-cradle-animation"
          >
            <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
              <p className="text-muted-foreground text-xs">Objects / O07</p>
              <h3
                className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
                id="newtons-cradle-animation-title"
              >
                One swing, passed along
              </h3>
              <p className="max-w-sm text-pretty text-muted-foreground text-sm">
                One end swings in and the other swings out. Equal lengths and
                fixed pivots carry the motion through a continuous rhythm.
              </p>
            </div>
            <div className="min-w-0 border-t lg:border-s lg:border-t-0">
              <EngineeringMotionPreview
                animated={<NewtonsCradleMotionDrawing />}
                caption="One swing · Alternating ends"
              >
                <NewtonsCradleStudy />
              </EngineeringMotionPreview>
            </div>
          </article>
          <article
            aria-labelledby="orbits-animation-title"
            className="mt-6 grid scroll-mt-20 overflow-hidden rounded-lg border border-border/64 bg-sidebar lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
            id="orbits-animation"
          >
            <div className="flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
              <p className="text-muted-foreground text-xs">Nature / M04</p>
              <h3
                className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
                id="orbits-animation-title"
              >
                Three orbits, three speeds
              </h3>
              <p className="max-w-sm text-pretty text-muted-foreground text-sm">
                Three planets leave one line together. The inner one circles
                four times for every turn of the outer one, and all three meet
                again at the start.
              </p>
            </div>
            <div className="min-w-0 border-t lg:border-s lg:border-t-0">
              <EngineeringMotionPreview
                animated={<OrbitsMotionDrawing />}
                caption="Inner · Middle · Outer"
              >
                <OrbitsStudy />
              </EngineeringMotionPreview>
            </div>
          </article>
        </section>
        <CossConcepts />
        <VisualGrammar />
        <section
          aria-labelledby="illustrations-heading"
          className="scroll-mt-16 border-t pt-12 md:pt-16"
          id="illustrations"
        >
          <h2
            className="mb-6 font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
            id="illustrations-heading"
          >
            Catalogue
          </h2>
          <p className="mb-6 max-w-2xl text-pretty text-muted-foreground text-sm">
            Choose a construction relationship to borrow, then{" "}
            <a className="underline underline-offset-4" href="#use-plotter">
              give Plotter your own brief
            </a>
            . The{" "}
            <a className="underline underline-offset-4" href="#visual-grammar">
              visual grammar
            </a>{" "}
            explains the marks behind these drawings.
          </p>
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
          <div className="flex max-w-xl flex-col gap-2">
            <h2 className="font-medium text-lg">Make a drawing of your own.</h2>
            <p className="text-pretty text-muted-foreground text-sm">
              Start with a relationship you found here. The skill includes the
              references and the workflow to develop it.
            </p>
          </div>
          <a
            className="shrink-0 text-sm underline underline-offset-4 hover:text-muted-foreground"
            href="#use-plotter"
          >
            Install and use Plotter ↑
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
