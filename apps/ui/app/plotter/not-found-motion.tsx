"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import { MissingDestinationBlueprint } from "./missing-destination";
import styles from "./not-found-motion.module.css";

export function NotFoundMotion({
  controls = "preview",
}: {
  controls?: "hero" | "preview";
}) {
  const drawing = useRef<HTMLDivElement>(null);
  const animation = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const svg = animation.current?.querySelector("svg");
    if (!svg) return;
    if (!live || reducedMotion || paused || !inView) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [live, reducedMotion, paused, inView]);

  const togglePlayback = () => {
    if (live) setPaused((value) => !value);
    else {
      setLive(true);
      setPaused(false);
    }
  };

  const replay = () => {
    const svg = animation.current?.querySelector("svg");
    svg?.setCurrentTime(0);
    if (inView && !reducedMotion) svg?.unpauseAnimations();
    setLive(true);
    setPaused(false);
  };

  return (
    <div>
      <div
        className={`relative mx-auto w-full max-w-140 select-none ${styles.drawing}`}
        data-live={(live && !reducedMotion) || undefined}
        ref={drawing}
      >
        <div className={`pointer-events-none ${styles.original}`}>
          <MissingDestinationBlueprint />
        </div>
        <div
          className={`pointer-events-none absolute inset-0 ${styles.animation}`}
          ref={animation}
        >
          <MissingDestinationBlueprint animated />
        </div>
        {controls === "hero" && !reducedMotion && (
          <Button
            aria-label={paused ? "Resume illustration" : "Pause illustration"}
            className="pointer-events-auto absolute right-0 bottom-0 rounded-full text-muted-foreground motion-reduce:hidden"
            onClick={togglePlayback}
            size="icon-sm"
            variant="ghost"
          >
            {paused ? (
              <PlayIcon aria-hidden="true" />
            ) : (
              <PauseIcon aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
      {controls === "preview" && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-6">
          <p className="text-muted-foreground text-xs">
            A request approaches · The gap remains
          </p>
          <div className="flex flex-wrap items-center gap-1 motion-reduce:hidden">
            <Button onClick={togglePlayback} size="sm" variant="ghost">
              {live && !paused ? (
                <PauseIcon aria-hidden="true" />
              ) : (
                <PlayIcon aria-hidden="true" />
              )}
              {live ? (paused ? "Resume" : "Pause") : "Play animation"}
            </Button>
            <Button onClick={replay} size="sm" variant="ghost">
              <RotateCcwIcon aria-hidden="true" />
              Replay
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
      )}
    </div>
  );
}
