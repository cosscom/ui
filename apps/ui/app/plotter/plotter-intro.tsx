import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";

export function PlotterIntro() {
  return (
    <header className="flex flex-col items-start gap-5 py-12 md:py-16 lg:py-20">
      <h1 className="text-balance font-bold font-heading text-[clamp(2.25rem,5vw,4rem)] leading-none [font-variation-settings:'GEOM'_50]">
        Plotter illustrations
      </h1>
      <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
        Simple forms. Fine lines. A skill for drawing and animating editable
        illustrations, with a shared visual language behind every mark.
      </p>
      <nav
        aria-label="Plotter sections"
        className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
      >
        <Button render={<a href="#use-plotter" />}>
          Use Plotter <ArrowDownIcon aria-hidden="true" />
        </Button>
        <a
          className="underline underline-offset-4 hover:text-muted-foreground"
          href="#illustrations"
        >
          Catalogue
        </a>
        <a
          className="underline underline-offset-4 hover:text-muted-foreground"
          href="#visual-grammar"
        >
          Visual grammar
        </a>
        <a
          className="underline underline-offset-4 hover:text-muted-foreground"
          href="#animations"
        >
          Animations
        </a>
        <a
          className="underline underline-offset-4 hover:text-muted-foreground"
          href="#plotter-tokens"
        >
          Customization
        </a>
        <a
          className="underline underline-offset-4 hover:text-muted-foreground"
          href="#coss-concepts"
        >
          coss.com concepts
        </a>
      </nav>
    </header>
  );
}
