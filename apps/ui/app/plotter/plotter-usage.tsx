import { DownloadIcon, FolderIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { EngineeringMotionPreview } from "./engineering-motion-preview";
import { ProductionChainStudy } from "./engineering-studies";
import { expandedStudies } from "./expanded-studies";
import { PlotterPrompts } from "./plotter-prompts";
import { ProductionChainMotionDrawing } from "./production-chain-motion-drawing";
import { plotterDownload } from "./plotter-usage-content";

export function PlotterUsage() {
  const registration = expandedStudies.find(
    (study) => study.id === "agent-registration",
  );
  if (!registration)
    throw new Error("Plotter’s registration example is missing.");

  return (
    <section
      aria-labelledby="use-plotter-heading"
      className="flex scroll-mt-20 flex-col gap-10 border-t py-12 md:py-16"
      id="use-plotter"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2
          className="font-heading font-semibold text-3xl [font-variation-settings:'GEOM'_50]"
          id="use-plotter-heading"
        >
          Use Plotter
        </h2>
        <p className="text-pretty text-muted-foreground">
          Give your coding agent the references, drawing rules, and helpers
          behind this collection. One skill covers still illustrations and
          animation.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:gap-8">
        <div className="flex max-w-lg flex-col items-start gap-4">
          <h3 className="font-medium text-lg">
            1. Install the complete skill.
          </h3>
          <p className="text-pretty text-muted-foreground text-sm">
            Download and unzip the package. Put the entire{" "}
            <code className="text-foreground">plotter</code> folder in your
            agent’s skills directory, keeping its files together. Start a task
            with <code className="text-foreground">$plotter</code>.
          </p>
          <Button
            render={
              <a download="plotter.zip" href={plotterDownload("plotter.zip")} />
            }
          >
            <DownloadIcon aria-hidden="true" />
            Download Plotter <span className="text-xs opacity-64">.zip</span>
          </Button>
          <p className="text-muted-foreground text-xs">
            Includes both workflows, seven visual references, the grammar,
            shared tokens, helpers, and examples. No coss checkout required.
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-4 rounded-lg border bg-background p-5 sm:p-6">
          <p className="flex items-center gap-2 font-medium text-sm">
            <FolderIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            Keep the folder intact
          </p>
          <pre className="overflow-x-auto font-mono text-muted-foreground text-xs leading-relaxed">{`plotter/
  SKILL.md       ← your agent starts here
  references/    ← workflows and visual grammar
  assets/        ← shared tokens and examples
  scripts/       ← generation and static export
  agents/        ← skill discovery metadata`}</pre>
          <p className="text-pretty text-muted-foreground text-xs">
            For Codex, the default destination is{" "}
            <code className="break-all text-foreground">
              ~/.codex/skills/plotter/
            </code>
            . If you use a custom <code>CODEX_HOME</code>, place it under that
            directory’s <code>skills/</code> folder.
          </p>
          <details className="border-t pt-4 text-sm">
            <summary className="cursor-pointer font-medium">
              Use it without installing
            </summary>
            <p className="pt-3 text-pretty text-muted-foreground">
              Open the extracted folder in your coding agent. Ask it to read{" "}
              <code className="text-foreground">plotter/SKILL.md</code> from the
              parent folder, then give it your brief. Keep the linked references
              and assets accessible.
            </p>
          </details>
        </div>
      </div>
      <div className="flex flex-col gap-5 border-t pt-8">
        <h3 className="font-medium text-lg">
          2. Choose a workflow and copy a brief.
        </h3>
        <PlotterPrompts
          drawing={registration.illustration}
          animation={
            <EngineeringMotionPreview
              animated={<ProductionChainMotionDrawing />}
              caption="Load · Seat · Advance"
            >
              <ProductionChainStudy />
            </EngineeringMotionPreview>
          }
        />
      </div>
    </section>
  );
}
