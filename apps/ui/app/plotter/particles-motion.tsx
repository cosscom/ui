"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import {
  ParticlesAssemblyDrawing,
  particlesSequenceDuration,
} from "./particles-assembly-drawing";
import styles from "./particles-motion.module.css";

const chapters = ["Workspace", "Booking", "Activity"];
const chapterDuration = particlesSequenceDuration / chapters.length;

export function ParticlesMotion({
  children,
  controls = "hero",
}: {
  children: ReactNode;
  controls?: "hero" | "preview";
}) {
  const drawing = useRef<HTMLDivElement>(null);
  const animation = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [stage, setStage] = useState(0);
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
    if (!live || reducedMotion || paused || !inView) {
      svg.pauseAnimations();
      return;
    }

    svg.unpauseAnimations();
    const updateStage = () => {
      const time = svg.getCurrentTime() % particlesSequenceDuration;
      // SVG clock precision can place a chapter seek just before its boundary.
      setStage(
        Math.max(
          0,
          Math.min(
            chapters.length - 1,
            Math.floor((time + 0.0001) / chapterDuration),
          ),
        ),
      );
    };
    updateStage();
    const timer = window.setInterval(updateStage, 100);
    return () => window.clearInterval(timer);
  }, [paused, inView, live, reducedMotion]);

  const seek = (chapter: number) => {
    const svg = animation.current?.querySelector("svg");
    svg?.setCurrentTime(chapter * chapterDuration);
    if (inView && !reducedMotion) svg?.unpauseAnimations();
    setStage(chapter);
    setLive(true);
    setPaused(false);
  };

  const togglePlayback = () => {
    if (!live) {
      setLive(true);
      setPaused(false);
    } else setPaused((value) => !value);
  };

  return (
    <div>
      <div
        className={`relative mx-auto w-full max-w-140 select-none ${styles.drawing}`}
        data-live={(live && !reducedMotion) || undefined}
        ref={drawing}
      >
        <div className={`pointer-events-none ${styles.original}`}>
          {children}
        </div>
        <div
          className={`pointer-events-none absolute inset-0 ${styles.animation}`}
          ref={animation}
        >
          <ParticlesAssemblyDrawing />
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
          <div className="flex flex-wrap items-center gap-1 motion-reduce:hidden">
            {chapters.map((chapter, index) => (
              <Button
                aria-current={live && stage === index ? "step" : undefined}
                className="text-muted-foreground text-xs aria-[current=step]:bg-foreground/5 aria-[current=step]:text-foreground"
                key={chapter}
                onClick={() => seek(index)}
                size="sm"
                variant="ghost"
              >
                <span className="text-muted-foreground">0{index + 1}</span>
                {chapter}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1 motion-reduce:hidden">
            {live && (
              <Button onClick={togglePlayback} size="sm" variant="ghost">
                {paused ? (
                  <PlayIcon aria-hidden="true" />
                ) : (
                  <PauseIcon aria-hidden="true" />
                )}
                {paused ? "Resume" : "Pause"}
              </Button>
            )}
            <Button
              onClick={() => (live ? seek(0) : togglePlayback())}
              size="sm"
              variant="ghost"
            >
              {live ? (
                <RotateCcwIcon aria-hidden="true" />
              ) : (
                <PlayIcon aria-hidden="true" />
              )}
              {live ? "Replay" : "Play animation"}
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
