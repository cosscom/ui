"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  StarIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button, buttonVariants } from "@/registry/default/ui/button";
import type { IllustrationStudy, StudyCategory } from "./study-types";

const categories: StudyCategory[] = [
  "Primitives",
  "Particles",
  "Cal.com",
  "Interfaces",
  "Services",
  "Workflows",
  "Data",
  "Documents",
  "Typography",
  "States",
  "404",
  "Objects",
];

function studyLabel(study: IllustrationStudy) {
  if (study.selected) return "Selected for coss";
  if (study.review === "reference") return "Style reference";
  if (study.review === "outside") return "Outside direction";
  if (study.review === "partial") {
    return study.revision ? "Revised · awaiting review" : "Partly fits";
  }
  if (study.revision) return "Revised 2D study";
  return study.baseline ? "Original study" : "Unreviewed";
}

const heroCopy: Record<
  StudyCategory,
  { title: string; description: string; action: string }
> = {
  "Cal.com": {
    title: "Make time for what matters.",
    description:
      "A clear path from finding the right time to meeting the right person.",
    action: "Find a time",
  },
  Interfaces: {
    title: "Every detail has a place.",
    description:
      "Thoughtful parts, composed into interfaces that feel natural to use.",
    action: "Explore components",
  },
  Services: {
    title: "Systems, made visible.",
    description:
      "From a request to a response, from an idea to a release. A precise drawing of how things connect.",
    action: "Explore the system",
  },
  Documents: {
    title: "Ideas, given a home.",
    description:
      "Collect what you know. Give it structure. Make it easy to discover.",
    action: "Open the library",
  },
  Workflows: {
    title: "Good connections move things forward.",
    description:
      "Bring the right steps together, with a clear route from start to finish.",
    action: "Explore workflows",
  },
  Objects: {
    title: "Familiar forms. Precise construction.",
    description:
      "Familiar objects reveal the small decisions that make a design work.",
    action: "Look closer",
  },
  Data: {
    title: "Find the shape in your information.",
    description:
      "Give complex information a clear structure, so the useful details emerge.",
    action: "Explore your data",
  },
  Typography: {
    title: "Character, by construction.",
    description:
      "A curve, a counter, a carefully chosen proportion. Small decisions build an identity.",
    action: "Explore the details",
  },
  States: {
    title: "Clarity at every step.",
    description:
      "A missing destination or a completed task, expressed in a single clear picture.",
    action: "Find your next step",
  },
  "404": {
    title: "Page Not Found",
    description:
      "The page you’re looking for doesn’t exist or may have been moved.",
    action: "Back to Home",
  },
  Primitives: {
    title: "A new, modern UI component library built on top of Base UI.",
    description: "Built for developers and AI.",
    action: "Get started",
  },
  Particles: {
    title: "Browse Particles",
    description:
      "Ready-to-use particles, the building blocks of your design system. Small pieces, endless possibilities.",
    action: "Explore particles",
  },
};

export function IllustrationLab({ studies }: { studies: IllustrationStudy[] }) {
  const params = useSearchParams();
  const firstStudy = studies.find((study) => study.review !== "outside");
  if (!firstStudy) throw new Error("The illustration lab needs a study.");
  const active =
    studies.find((study) => study.id === params.get("variant")) ?? firstStudy;
  const showEarlier =
    params.get("scope") === "all" || active.review === "outside";
  const workingStudies = studies.filter((study) => study.review !== "outside");
  const visibleStudies = showEarlier ? studies : workingStudies;
  const visibleCategories = categories.filter((category) =>
    visibleStudies.some((study) => study.category === category),
  );
  const view = params.get("view") === "hero" ? "hero" : "drawing";
  const categoryStudies = visibleStudies.filter(
    (study) => study.category === active.category,
  );
  const position = categoryStudies.findIndex((study) => study.id === active.id);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState("");
  const stage = useRef<HTMLElement>(null);

  const selectStudy = useCallback((id: string) => {
    const next = new URLSearchParams(window.location.search);
    next.set("variant", id);
    window.history.replaceState(null, "", `?${next}`);
  }, []);

  const cycle = useCallback(
    (direction: number) => {
      const group = studies.filter(
        (study) =>
          study.category === active.category &&
          (showEarlier || study.review !== "outside"),
      );
      const index = group.findIndex((study) => study.id === active.id);
      const nextStudy =
        group[(index + direction + group.length) % group.length];
      if (nextStudy) selectStudy(nextStudy.id);
    },
    [active.category, active.id, selectStudy, showEarlier, studies],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          "input, textarea, select, [contenteditable], [role=tablist], [role=radiogroup]",
        )
      )
        return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        cycle(event.key === "ArrowLeft" ? -1 : 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cycle]);

  function setView(nextView: string) {
    const next = new URLSearchParams(window.location.search);
    next.set("view", nextView);
    next.set("variant", active.id);
    window.history.replaceState(null, "", `?${next}`);
  }

  function setScope(includeEarlier: boolean) {
    const next = new URLSearchParams(window.location.search);
    if (includeEarlier) {
      next.set("scope", "all");
    } else {
      next.delete("scope");
      const selection =
        active.review !== "outside"
          ? active
          : (workingStudies.find(
              (study) => study.category === active.category,
            ) ?? firstStudy);
      if (selection) next.set("variant", selection.id);
    }
    window.history.replaceState(null, "", `?${next}`);
  }

  function toggleShortlist(id: string) {
    setShortlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setCopyStatus("");
  }

  async function copyShortlist() {
    const selected = studies.filter((study) => shortlist.includes(study.id));
    const text = selected
      .map((study) => `${study.code} · ${study.category} · ${study.title}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(
        `My illustration shortlist:\n${text}`,
      );
      setCopyStatus("Copied — paste your choices into the chat.");
    } catch {
      setCopyStatus(
        "Copy unavailable. You can share the study codes below instead.",
      );
    }
  }

  const copy = heroCopy[active.category];

  return (
    <main className="container w-full pb-32 [font-optical-sizing:auto] [font-synthesis:none]">
      <header className="flex flex-col gap-4 py-10 md:py-14">
        <p className="text-muted-foreground text-xs">
          Plotter / {workingStudies.length} current studies /{" "}
          {studies.filter((study) => study.revision).length} revised
        </p>
        <h1 className="font-bold font-heading text-4xl leading-none [font-variation-settings:'GEOM'_50] md:text-5xl">
          Flat forms. Clear construction.
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          Primitives and Particles set the reference: geometric forms and small
          interface elements drawn as precise 2D constructions. Guides reveal
          how the composition is built.
        </p>
      </header>

      <div className="flex flex-col gap-4 border-b pb-5">
        <div
          aria-label="Study scope"
          className="flex flex-wrap gap-1"
          role="group"
        >
          <Button
            aria-pressed={!showEarlier}
            onClick={() => setScope(false)}
            size="sm"
            variant={!showEarlier ? "secondary" : "ghost"}
          >
            Current direction {workingStudies.length}
          </Button>
          <Button
            aria-pressed={showEarlier}
            onClick={() => setScope(true)}
            size="sm"
            variant={showEarlier ? "secondary" : "ghost"}
          >
            All experiments {studies.length}
          </Button>
        </div>
        <div
          aria-label="Illustration category"
          className="flex flex-wrap gap-1"
          role="group"
        >
          {visibleCategories.map((category) => (
            <Button
              aria-pressed={active.category === category}
              key={category}
              onClick={() =>
                selectStudy(
                  visibleStudies.find((study) => study.category === category)
                    ?.id ?? firstStudy.id,
                )
              }
              variant={active.category === category ? "default" : "ghost"}
            >
              {category}
              <span className="text-xs opacity-64">
                {
                  visibleStudies.filter((study) => study.category === category)
                    .length
                }
              </span>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-muted-foreground text-sm">
            {active.category} / {categoryStudies.length}{" "}
            {categoryStudies.length === 1 ? "study" : "studies"}
          </p>
          <div aria-label="Preview context" className="flex gap-1" role="group">
            <Button
              aria-pressed={view === "drawing"}
              onClick={() => setView("drawing")}
              size="sm"
              variant={view === "drawing" ? "secondary" : "ghost"}
            >
              Drawing
            </Button>
            <Button
              aria-pressed={view === "hero"}
              onClick={() => setView("hero")}
              size="sm"
              variant={view === "hero" ? "secondary" : "ghost"}
            >
              In a hero
            </Button>
          </div>
        </div>
      </div>

      <section className="scroll-mt-20 border-b" ref={stage}>
        <div className="flex items-start justify-between gap-4 pt-6">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs">
              {active.code} / {active.category}
              {" / "}
              {studyLabel(active)}
            </p>
            <h2 className="font-medium text-lg">{active.title}</h2>
            {active.reviewNote && (
              <p className="max-w-xl text-muted-foreground text-xs">
                {active.reviewNote}
              </p>
            )}
          </div>
          <Button
            aria-pressed={shortlist.includes(active.id)}
            onClick={() => toggleShortlist(active.id)}
            size="sm"
            variant="outline"
          >
            <StarIcon
              aria-hidden="true"
              className={
                shortlist.includes(active.id) ? "fill-current" : undefined
              }
            />
            {shortlist.includes(active.id) ? "Shortlisted" : "Shortlist"}
          </Button>
        </div>
        {view === "drawing" ? (
          <div className="mx-auto w-full max-w-160 py-3 md:py-0">
            {active.illustration}
          </div>
        ) : (
          <div
            className={cn(
              "py-10 [font-optical-sizing:auto] [font-synthesis:none] md:py-14 lg:py-16",
              active.category === "404"
                ? "flex flex-col items-center gap-5 text-center"
                : "grid items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-16",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 flex-col gap-5",
                active.category === "404" ? "items-center" : "items-start",
              )}
            >
              <h2
                className={cn(
                  "text-balance font-bold font-heading text-4xl leading-[1.08] [font-variation-settings:'GEOM'_50] lg:text-5xl",
                  active.category !== "404" && "xl:text-[3.5rem]",
                )}
              >
                {copy.title}
              </h2>
              <p className="max-w-md text-pretty text-muted-foreground lg:text-lg">
                {copy.description}
              </p>
              <span
                className={cn(
                  buttonVariants({ size: "lg" }),
                  active.category === "404" && "group",
                )}
              >
                {active.category === "404" && (
                  <RiArrowLeftLine
                    aria-hidden="true"
                    className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                  />
                )}
                {copy.action}
              </span>
            </div>
            <div
              className={cn(
                "pointer-events-none mx-auto w-full select-none",
                active.category === "404"
                  ? "order-first max-w-112"
                  : "max-w-140 max-lg:max-w-112",
              )}
            >
              {active.illustration}
            </div>
          </div>
        )}
        <p className="mx-auto max-w-xl pb-7 text-center text-muted-foreground text-sm">
          {active.description}
        </p>
      </section>

      <section aria-label={`${active.category} studies`} className="py-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-medium">All {active.category} studies</h2>
          <p className="text-muted-foreground text-xs">
            Select a drawing to inspect it above.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoryStudies.map((study) => (
            <article
              className={cn(
                "relative min-w-0 rounded-xl border",
                active.id === study.id && "border-foreground/48",
              )}
              key={study.id}
            >
              <button
                aria-pressed={active.id === study.id}
                className="flex w-full cursor-pointer flex-col rounded-xl text-start outline-none hover:bg-muted/24 focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  selectStudy(study.id);
                  stage.current?.scrollIntoView({ block: "start" });
                }}
                type="button"
              >
                <div className="w-full p-3 pt-6">{study.illustration}</div>
                <div className="flex w-full flex-col gap-1 border-t px-5 py-4">
                  <span className="text-muted-foreground text-xs">
                    {study.code}
                    {" / "}
                    {studyLabel(study)}
                  </span>
                  <span className="font-medium">{study.title}</span>
                </div>
              </button>
              <Button
                aria-label={`Shortlist ${study.code}: ${study.title}`}
                aria-pressed={shortlist.includes(study.id)}
                className="absolute end-2 top-2"
                onClick={() => toggleShortlist(study.id)}
                size="icon-sm"
                variant="ghost"
              >
                <StarIcon
                  aria-hidden="true"
                  className={
                    shortlist.includes(study.id) ? "fill-current" : undefined
                  }
                />
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium">
            Your shortlist{" "}
            <span className="text-muted-foreground">/ {shortlist.length}</span>
          </h2>
          <Button
            disabled={!shortlist.length}
            onClick={copyShortlist}
            size="sm"
            variant="outline"
          >
            <CopyIcon aria-hidden="true" />
            Copy choices
          </Button>
        </div>
        {shortlist.length ? (
          <div className="flex flex-wrap gap-2">
            {studies
              .filter((study) => shortlist.includes(study.id))
              .map((study) => (
                <Button
                  key={study.id}
                  onClick={() => {
                    selectStudy(study.id);
                    stage.current?.scrollIntoView({ block: "start" });
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <CheckIcon aria-hidden="true" />
                  {study.code} · {study.title}
                </Button>
              ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Star the studies you like, then copy your choices into the chat.
          </p>
        )}
        <p aria-live="polite" className="text-muted-foreground text-xs">
          {copyStatus ||
            "Your shortlist lasts for this visit. Copy it before refreshing or leaving."}
        </p>
      </section>

      <details className="border-t py-6 text-sm">
        <summary className="cursor-pointer font-medium">
          The direction we’re keeping
        </summary>
        <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
          One flat drawing plane. Circles, rectangles, arcs, slots, and small
          interface fragments. Fine outlines, quieter guides, sparse dimensions,
          and generous empty space. Every guide explains a real relationship:
          radius, spacing, alignment, connection, or assembly. No perspective,
          volume, or tilted objects. The reference is a construction study,
          rather than an object, screen mockup, or large pictogram decorated
          with technical marks. Unreviewed studies remain candidates, not
          approvals.
        </p>
      </details>

      <nav
        aria-label="Cycle illustration studies"
        className="fixed inset-x-4 bottom-5 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-xl border bg-popover p-2 shadow-lg/8"
      >
        <Button
          aria-label="Previous study"
          disabled={categoryStudies.length < 2}
          onClick={() => cycle(-1)}
          size="icon"
          variant="ghost"
        >
          <ArrowLeftIcon aria-hidden="true" />
        </Button>
        <div className="min-w-0 px-2 text-center" aria-live="polite">
          <p className="text-muted-foreground text-xs">
            {active.category} · {position + 1} / {categoryStudies.length}
          </p>
          <p className="max-w-64 truncate font-medium text-sm">
            {active.code} · {active.title}
          </p>
        </div>
        <Button
          aria-label="Next study"
          disabled={categoryStudies.length < 2}
          onClick={() => cycle(1)}
          size="icon"
          variant="ghost"
        >
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </nav>
    </main>
  );
}
