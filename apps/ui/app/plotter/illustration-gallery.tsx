"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/registry/default/ui/button";
import type { IllustrationStudy, StudyCategory } from "./study-types";

const categories: StudyCategory[] = [
  "Foundations",
  "Interfaces",
  "Scheduling",
  "Services",
  "Systems",
  "Objects",
  "Empty states",
  "Agents",
  "Mechanisms",
  "Architecture",
  "Nature",
  "Music",
  "Maps",
  "Typography",
  "Craft",
  "Play",
];

export function IllustrationGallery({
  illustrations,
}: {
  illustrations: IllustrationStudy[];
}) {
  const params = useSearchParams();
  const linkedIllustration = illustrations.find(
    (item) => item.id === params.get("variant"),
  );
  const category =
    linkedIllustration?.category ??
    categories.find((item) => item === params.get("category"));
  const visible = category
    ? illustrations.filter((item) => item.category === category)
    : illustrations;
  const linkedId = linkedIllustration?.id;

  // Existing preview URLs now locate the drawing directly in the gallery.
  useEffect(() => {
    if (linkedId) document.getElementById(linkedId)?.scrollIntoView();
  }, [linkedId]);

  function updateParams(values: Record<string, string | null>) {
    const next = new URLSearchParams(window.location.search);
    next.delete("view");
    next.delete("scope");
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}#illustrations`,
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
        <div
          aria-label="Filter illustrations"
          className="flex flex-wrap gap-1"
          role="group"
        >
          {["All", ...categories].map((item) => (
            <Button
              aria-pressed={item === (category ?? "All")}
              key={item}
              onClick={() =>
                updateParams({
                  category: item === "All" ? null : item,
                  variant: null,
                })
              }
              size="sm"
              variant={item === (category ?? "All") ? "secondary" : "ghost"}
            >
              {item}
            </Button>
          ))}
        </div>
        <p
          aria-live="polite"
          className="shrink-0 text-muted-foreground text-xs tabular-nums"
        >
          {visible.length} illustrations
        </p>
      </div>

      <ul
        aria-label={
          category ? `${category} illustrations` : "All illustrations"
        }
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,600px),1fr))] gap-x-6 gap-y-12 py-8 lg:py-10"
      >
        {visible.map((item) => (
          <li className="min-w-0 scroll-mt-24" id={item.id} key={item.id}>
            <figure>
              <div
                aria-label={`${item.title} illustration`}
                className="overflow-x-auto rounded-lg border border-border/64 bg-sidebar p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="img"
                // biome-ignore lint/a11y/noNoninteractiveTabindex: Native-size drawings need keyboard scrolling on narrow screens.
                tabIndex={0}
              >
                <div className="pointer-events-none mx-auto w-[560px] select-none">
                  {item.illustration}
                </div>
              </div>
              <figcaption className="flex items-start justify-between gap-4 px-1 pt-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-base">{item.title}</h3>
                  <p className="text-muted-foreground text-xs">
                    {item.category}
                  </p>
                  <p className="text-pretty pt-2 text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 pt-1 font-mono text-muted-foreground text-xs">
                  {item.code}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
