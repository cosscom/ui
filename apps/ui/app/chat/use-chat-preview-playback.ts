"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

export type PlaybackStep =
  | { type: "draft" | "send" | "reply"; text: string }
  | { type: "delivered" | "typing" };

const EXCHANGES = [
  [
    "Can we simplify the first step?",
    "Absolutely. Just a name and email to get started.",
  ],
  [
    "Nice. And keep the invite optional?",
    "Yes! They can invite their team whenever they’re ready.",
  ],
  [
    "I’ll give it one more pass on mobile.",
    "Thanks. I’ve just updated the prototype for you.",
  ],
  ["Looks good. Let’s ship it!", "Perfect. I’ll get the release ready 🎉"],
] as const;

const STEPS: { delay: number; event: PlaybackStep }[] = EXCHANGES.flatMap(
  ([message, reply]) => {
    const letters = Array.from(message);
    return [
      ...letters.map((_, index) => ({
        delay: index === 0 ? 1600 : 45,
        event: {
          type: "draft" as const,
          text: letters.slice(0, index + 1).join(""),
        },
      })),
      { delay: 650, event: { type: "send" as const, text: message } },
      { delay: 500, event: { type: "delivered" as const } },
      { delay: 600, event: { type: "typing" as const } },
      { delay: 1500, event: { type: "reply" as const, text: reply } },
    ];
  },
);

export function useChatPreviewPlayback(onStep: (step: PlaybackStep) => void) {
  const ref = useRef<HTMLElement>(null);
  const nextStep = useRef(0);
  const stopped = useRef(false);
  const [available, setAvailable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"playing" | "complete" | "stopped">(
    "playing",
  );
  const applyStep = useEffectEvent(onStep);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setAvailable(!motion.matches);
    let inView = false;
    const updateVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = (entry?.intersectionRatio ?? 0) >= 0.5;
        updateVisibility();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    updateMotion();
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!available || !visible || status !== "playing") return;
    let timer: number;
    const schedule = () => {
      const step = STEPS[nextStep.current];
      if (!step) {
        setStatus("complete");
        return;
      }
      timer = window.setTimeout(() => {
        if (stopped.current) return;
        nextStep.current += 1;
        applyStep(step.event);
        schedule();
      }, step.delay);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [available, visible, status]);

  return {
    ref,
    active: available && status === "playing",
    stop: () => {
      if (stopped.current) return false;
      stopped.current = true;
      setStatus("stopped");
      return status !== "complete";
    },
  };
}
