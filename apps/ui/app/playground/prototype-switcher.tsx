"use client";

// PROTOTYPE ONLY. A floating bar for flipping between prototype variants.
// Hidden in production builds.

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { cn } from "@/registry/default/lib/utils";

type Choice = { key: string; label: string };

type PrototypeSwitcherProps = {
  variants: Choice[];
  variant: string;
  scenarios?: Choice[];
  scenario?: string;
};

export function PrototypeSwitcher({
  variants,
  variant,
  scenarios,
  scenario,
}: PrototypeSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const go = useCallback(
    (nextVariant: string, nextScenario: string | undefined) => {
      const params = new URLSearchParams({ variant: nextVariant });
      if (nextScenario) {
        params.set("scenario", nextScenario);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  const cycleVariant = useCallback(
    (step: number) => {
      const index = variants.findIndex((item) => item.key === variant);
      const next = variants[(index + step + variants.length) % variants.length];
      if (next) {
        go(next.key, scenario);
      }
    },
    [go, scenario, variant, variants],
  );

  const cycleScenario = () => {
    if (!scenarios?.length) {
      return;
    }
    const index = scenarios.findIndex((item) => item.key === scenario);
    const next = scenarios[(index + 1) % scenarios.length];
    if (next) {
      go(variant, next.key);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input, textarea, select, [contenteditable], [role=combobox], [role=listbox], [role=radiogroup]",
        )
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        cycleVariant(-1);
      } else if (event.key === "ArrowRight") {
        cycleVariant(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycleVariant]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // Once a prototype is down to its chosen variant, there is nothing to flip.
  const hasVariants = variants.length > 1;
  if (!hasVariants && !scenarios?.length) {
    return null;
  }

  const currentVariant = variants.find((item) => item.key === variant);
  const currentScenario = scenarios?.find((item) => item.key === scenario);

  return (
    <div className="fixed start-1/2 bottom-4 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900 p-1 font-mono text-neutral-50 text-xs shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
      {hasVariants ? (
        <>
          <button
            aria-label="Previous variant"
            className="flex size-7 items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-black/10"
            onClick={() => cycleVariant(-1)}
            type="button"
          >
            <ChevronLeftIcon aria-hidden="true" className="size-4" />
          </button>
          <span className="min-w-40 px-1 text-center">
            {currentVariant
              ? `${currentVariant.key} (${currentVariant.label})`
              : variant}
          </span>
          <button
            aria-label="Next variant"
            className="flex size-7 items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-black/10"
            onClick={() => cycleVariant(1)}
            type="button"
          >
            <ChevronRightIcon aria-hidden="true" className="size-4" />
          </button>
        </>
      ) : null}
      {scenarios?.length ? (
        <button
          className={cn(
            "h-7 rounded-full border border-white/25 px-3 hover:bg-white/15 dark:border-black/20 dark:hover:bg-black/10",
            hasVariants && "ms-1",
          )}
          onClick={cycleScenario}
          type="button"
        >
          Scenario: {currentScenario?.label ?? scenario}
        </button>
      ) : null}
    </div>
  );
}
