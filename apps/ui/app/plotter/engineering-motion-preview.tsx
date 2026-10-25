"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import styles from "./engineering-motion-preview.module.css";

export function EngineeringMotionPreview({
  animated,
  caption,
  children,
}: {
  animated: ReactNode;
  caption: string;
  children: ReactNode;
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
    if (!live || paused || reducedMotion || !inView) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [live, paused, reducedMotion, inView]);

  const togglePlayback = () => {
    if (live) setPaused((value) => !value);
    else {
      setLive(true);
      setPaused(false);
    }
  };

  const replay = () => {
    animation.current?.querySelector("svg")?.setCurrentTime(0);
    setLive(true);
    setPaused(false);
  };

  return (
    <div>
      <div
        className={`pointer-events-none relative mx-auto w-full max-w-140 select-none ${styles.drawing}`}
        data-live={(live && !reducedMotion) || undefined}
        ref={drawing}
      >
        <div className={styles.original}>{children}</div>
        <div className={`absolute inset-0 ${styles.animation}`} ref={animation}>
          {animated}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-6">
        <p className="text-muted-foreground text-xs">{caption}</p>
        <div className="flex flex-wrap items-center gap-1 motion-reduce:hidden">
          <Button
            onClick={togglePlayback}
            size="sm"
            type="button"
            variant="ghost"
          >
            {live && !paused ? (
              <PauseIcon aria-hidden="true" />
            ) : (
              <PlayIcon aria-hidden="true" />
            )}
            {live ? (paused ? "Resume" : "Pause") : "Play animation"}
          </Button>
          <Button onClick={replay} size="sm" type="button" variant="ghost">
            <RotateCcwIcon aria-hidden="true" />
            Replay
          </Button>
          {live && (
            <Button
              onClick={() => setLive(false)}
              size="sm"
              type="button"
              variant="ghost"
            >
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
