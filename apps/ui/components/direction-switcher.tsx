"use client";

import { PilcrowLeftIcon, PilcrowRightIcon } from "lucide-react";
import { type ReactNode, useSyncExternalStore } from "react";
import { DirectionProvider } from "@/registry/default/base-ui/direction-provider";
import { Button } from "@/registry/default/ui/button";
import { DIRECTION_STORAGE_KEY } from "@/lib/direction";

type Direction = "ltr" | "rtl";

const listeners = new Set<() => void>();

function applyDirection(direction: Direction) {
  document.documentElement.dir = direction;
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== DIRECTION_STORAGE_KEY) return;
  applyDirection(event.newValue === "rtl" ? "rtl" : "ltr");
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getDirection(): Direction {
  return document.documentElement.dir === "rtl" ? "rtl" : "ltr";
}

function getServerDirection(): Direction {
  return "ltr";
}

function setDirection(direction: Direction) {
  try {
    localStorage.setItem(DIRECTION_STORAGE_KEY, direction);
  } catch {}
  applyDirection(direction);
}

function useSiteDirection() {
  return useSyncExternalStore(subscribe, getDirection, getServerDirection);
}

export function SiteDirectionProvider({ children }: { children: ReactNode }) {
  const direction = useSiteDirection();

  return (
    <DirectionProvider direction={direction}>{children}</DirectionProvider>
  );
}

export function DirectionSwitcher() {
  const isRtl = useSiteDirection() === "rtl";

  return (
    <Button
      aria-label="Toggle direction"
      className="size-8"
      onClick={() => setDirection(isRtl ? "ltr" : "rtl")}
      size="icon"
      title="Toggle direction"
      variant="ghost"
    >
      <PilcrowRightIcon aria-hidden="true" className="size-4 rtl:hidden" />
      <PilcrowLeftIcon aria-hidden="true" className="hidden size-4 rtl:block" />
    </Button>
  );
}
