"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import styles from "./blueprint-motion.module.css";

export function BlueprintMotion({
  children,
  renderAnimation,
  controlClassName = "bottom-0",
}: {
  children: ReactNode;
  renderAnimation: (paused: boolean) => ReactNode;
  controlClassName?: string;
}) {
  const drawing = useRef<HTMLDivElement>(null);
  const animation = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const live = hasEntered && !reducedMotion;
  const stopped = paused || !inView || !pageVisible || !live;

  useEffect(() => {
    if (!drawing.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setHasEntered(true);
    });
    observer.observe(drawing.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!live) return;
    const svg = animation.current?.querySelector("svg");
    if (!svg) return;
    if (stopped) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [stopped, live]);

  return (
    <div
      className={`relative w-full select-none ${styles.drawing}`}
      data-live={live || undefined}
      ref={drawing}
    >
      <div className={`pointer-events-none ${styles.original}`}>{children}</div>
      {live && (
        <div
          className={`pointer-events-none absolute inset-0 ${styles.animation}`}
          ref={animation}
        >
          {renderAnimation(stopped)}
        </div>
      )}
      {live && (
        <Button
          aria-label={paused ? "Resume illustration" : "Pause illustration"}
          className={`pointer-events-auto absolute right-0 rounded-full text-muted-foreground motion-reduce:hidden ${controlClassName}`}
          onClick={() => setPaused((value) => !value)}
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
  );
}
