"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import { PrimitivesMorph } from "./primitives-morph";
import styles from "./primitives-motion.module.css";

export function PrimitivesMotionPreview({ children }: { children: ReactNode }) {
  const drawing = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!drawing.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setInView(entry.isIntersecting);
    });
    observer.observe(drawing.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div
        className={`pointer-events-none relative mx-auto w-full max-w-140 select-none ${styles.drawing}`}
        data-live={(live && !reducedMotion) || undefined}
        ref={drawing}
      >
        <div className={styles.original}>{children}</div>
        {live && !reducedMotion && (
          <PrimitivesMorph paused={paused || !inView} />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-6">
        <p className="text-muted-foreground text-xs">Continuous loop</p>
        <div className="flex items-center gap-1 motion-reduce:hidden">
          <Button
            onClick={() => {
              if (live) setPaused((value) => !value);
              else {
                setLive(true);
                setPaused(false);
              }
            }}
            size="sm"
            variant="ghost"
          >
            {live && !paused ? (
              <PauseIcon aria-hidden="true" />
            ) : (
              <PlayIcon aria-hidden="true" />
            )}
            {live ? (paused ? "Resume" : "Pause") : "Play animation"}
          </Button>
          {live && (
            <Button onClick={() => setLive(false)} size="sm" variant="ghost">
              Show static
            </Button>
          )}
        </div>
        <p className="hidden text-muted-foreground text-xs motion-reduce:block">
          Reduced motion · Static drawing
        </p>
      </div>
    </div>
  );
}
