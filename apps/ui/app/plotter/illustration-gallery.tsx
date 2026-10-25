"use client";

import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/registry/default/ui/dialog";
import type { IllustrationStudy, StudyCategory } from "./study-types";

const categories: StudyCategory[] = [
  "Foundations",
  "Interfaces",
  "Scheduling",
  "Services",
  "Systems",
  "Objects",
  "Empty states",
];

export function IllustrationGallery({
  illustrations,
}: {
  illustrations: IllustrationStudy[];
}) {
  const params = useSearchParams();
  const category = categories.find((item) => item === params.get("category"));
  const visible = category
    ? illustrations.filter((item) => item.category === category)
    : illustrations;
  const active = illustrations.find(
    (item) => item.id === params.get("variant"),
  );
  const currentGroup =
    active && !visible.includes(active) ? illustrations : visible;
  const position = currentGroup.findIndex((item) => item.id === active?.id);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

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
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }

  function cycle(direction: number) {
    const next =
      currentGroup[
        (position + direction + currentGroup.length) % currentGroup.length
      ];
    if (next) updateParams({ variant: next.id });
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
        className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:py-10"
      >
        {visible.map((item) => (
          <li className="min-w-0" key={item.id}>
            <button
              aria-haspopup="dialog"
              aria-label={`View ${item.title}`}
              className="group flex w-full cursor-zoom-in flex-col text-start outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-sidebar"
              onClick={(event) => {
                lastTrigger.current = event.currentTarget;
                updateParams({ variant: item.id });
              }}
              type="button"
            >
              <div className="relative w-full rounded-lg border border-border/64 bg-sidebar p-2 transition-colors group-hover:border-foreground/24 sm:p-3">
                <div className="pointer-events-none aspect-14/11 w-full select-none">
                  {item.illustration}
                </div>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="absolute end-4 top-4 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </div>
              <div className="flex w-full items-start justify-between gap-3 px-1 pt-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-muted-foreground text-xs">
                    {item.category}
                  </p>
                </div>
                <span className="pt-0.5 font-mono text-muted-foreground text-xs">
                  {item.code}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={!!active}
        onOpenChange={(open) => {
          if (!open) updateParams({ variant: null });
        }}
      >
        <DialogPopup
          bottomStickOnMobile={false}
          className="max-w-3xl bg-sidebar"
          finalFocus={() => lastTrigger.current}
          onKeyDown={(event) => {
            if (
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            )
              return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              cycle(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          {active && (
            <>
              <DialogPanel className="p-5 sm:p-8">
                <p className="pe-8 text-muted-foreground text-xs">
                  {active.category} <span className="px-1">/</span>{" "}
                  {active.code}
                </p>
                <div className="pointer-events-none mx-auto w-full max-w-140 select-none">
                  {active.illustration}
                </div>
                <div className="space-y-2">
                  <DialogTitle>{active.title}</DialogTitle>
                  <DialogDescription className="max-w-xl text-pretty">
                    {active.description}
                  </DialogDescription>
                </div>
              </DialogPanel>
              <div className="flex items-center justify-between border-t p-3 sm:px-6">
                <Button
                  aria-label="Previous illustration"
                  onClick={() => cycle(-1)}
                  size="icon"
                  variant="ghost"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <p
                  aria-live="polite"
                  className="text-muted-foreground text-xs tabular-nums"
                >
                  {position + 1} / {currentGroup.length}
                </p>
                <Button
                  aria-label="Next illustration"
                  onClick={() => cycle(1)}
                  size="icon"
                  variant="ghost"
                >
                  <ArrowRightIcon aria-hidden="true" />
                </Button>
              </div>
            </>
          )}
        </DialogPopup>
      </Dialog>
    </>
  );
}
