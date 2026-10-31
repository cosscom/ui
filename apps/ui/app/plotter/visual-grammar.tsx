import { GrammarComparison } from "./grammar-comparison";
import { visualGrammarEntries } from "./visual-grammar-content";
import { visualGrammarDrawings } from "./visual-grammar-drawings";

export function VisualGrammar() {
  return (
    <section
      aria-labelledby="visual-grammar-heading"
      className="scroll-mt-20 border-t py-12 md:py-16"
      id="visual-grammar"
    >
      <div className="mb-8 space-y-3">
        <h2
          className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
          id="visual-grammar-heading"
        >
          Visual grammar
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground text-sm">
          A glossary of the marks these drawings use: what they mean, when they
          help, and when to leave them out. Hover over a drawing to isolate the
          marks being explained, then move away to see the whole construction.
        </p>
        <nav
          aria-label="Visual grammar topics"
          className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2 text-sm"
        >
          {visualGrammarEntries.map((entry) => (
            <a
              className="underline underline-offset-4 hover:text-muted-foreground"
              href={`#grammar-${entry.id}`}
              key={entry.id}
            >
              {entry.title}
            </a>
          ))}
        </nav>
      </div>
      <div className="divide-y">
        {visualGrammarEntries.map((entry) => (
          <article
            aria-labelledby={`grammar-${entry.id}-heading`}
            className="grid min-w-0 scroll-mt-20 gap-6 py-8 first:pt-0 last:pb-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:items-center xl:gap-12"
            id={`grammar-${entry.id}`}
            key={entry.id}
          >
            <div className="max-w-xl space-y-3">
              <h3
                className="font-medium text-lg"
                id={`grammar-${entry.id}-heading`}
              >
                {entry.title}
              </h3>
              <p className="text-pretty text-muted-foreground text-sm">
                {entry.description}
              </p>
              <p className="text-pretty text-muted-foreground text-sm">
                {entry.omit}
              </p>
            </div>
            <GrammarComparison caption={entry.caption} title={entry.title}>
              {visualGrammarDrawings[entry.id]}
            </GrammarComparison>
          </article>
        ))}
      </div>
    </section>
  );
}
