import { CommonInterfaceStudy } from "./common-interface-study";
import { SharedSystemStudy } from "./shared-system-study";

const concepts = [
  {
    code: "X01",
    title: "One interface, many services",
    description:
      "Different parts, one shared opening. Email, SMS, video, and scheduling meet a common SDK contract.",
    Drawing: CommonInterfaceStudy,
  },
  {
    code: "X07",
    title: "A common boundary",
    description:
      "Two complementary profiles form one system. A construction study of the interface between an app and coss.",
    Drawing: SharedSystemStudy,
  },
] as const;

export function CossConcepts() {
  return (
    <section
      aria-labelledby="coss-concepts-heading"
      className="scroll-mt-20 border-t py-12 md:py-16"
      id="coss-concepts"
    >
      <div className="mb-8 space-y-3">
        <h2
          className="font-heading font-semibold text-2xl [font-variation-settings:'GEOM'_50]"
          id="coss-concepts-heading"
        >
          coss.com concepts
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground text-sm">
          Two studies of a shared interface: different services, designed to fit
          together.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {concepts.map(({ code, title, description, Drawing }) => (
          <figure
            className="overflow-hidden rounded-lg border border-border/64 bg-sidebar"
            key={code}
          >
            <div className="mx-auto max-w-160 p-2 sm:p-4">
              <Drawing />
            </div>
            <figcaption className="flex items-start justify-between gap-4 border-t px-6 py-5">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">{title}</h3>
                <p className="text-pretty text-muted-foreground text-sm">
                  {description}
                </p>
              </div>
              <span className="font-mono text-muted-foreground text-xs">
                {code}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
