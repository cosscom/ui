"use client";

import {
  animate,
  domAnimation,
  LazyMotion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import type { BookerStep } from "@/lib/booker/use-booker";

const EASE = [0.32, 0.72, 0, 1] as const;
const SIZE_TRANSITION = { duration: 0.3, ease: EASE } as const;
const ENTER_TRANSITION = { delay: 0.05, duration: 0.4, ease: EASE } as const;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Size = { width: number; height: number };

const measure = (element: HTMLElement): Size => ({
  width: element.offsetWidth,
  height: element.offsetHeight,
});

function useStepTransition(step: BookerStep) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(step);
  const restingSizeRef = useRef<Size | null>(null);
  const isAnimatingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (!isAnimatingRef.current) {
        restingSizeRef.current = measure(container);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || previousStepRef.current === step) return;
    previousStepRef.current = step;

    const enteringStep = container.firstElementChild as HTMLElement | null;

    if (enteringStep && !reducedMotion) {
      enteringStep.style.opacity = "0";
    }

    const start = restingSizeRef.current ?? measure(container);
    container.style.width = "auto";
    container.style.height = "auto";
    enteringStep?.style.removeProperty("width");
    void container.offsetHeight;
    const end = measure(container);

    if (enteringStep) enteringStep.style.width = `${end.width}px`;
    container.style.width = `${start.width}px`;
    container.style.height = `${start.height}px`;

    isAnimatingRef.current = true;
    const sizeAnimation = animate(
      container,
      { width: end.width, height: end.height },
      reducedMotion ? { duration: 0 } : SIZE_TRANSITION,
    );
    const enterAnimation =
      enteringStep && !reducedMotion
        ? animate(enteringStep, { opacity: [0, 1] }, ENTER_TRANSITION)
        : null;

    void Promise.all([sizeAnimation, enterAnimation ?? Promise.resolve()]).then(
      () => {
        container.style.width = "";
        container.style.height = "";
        enteringStep?.style.removeProperty("width");
        enteringStep?.style.removeProperty("opacity");
        restingSizeRef.current = measure(container);
        isAnimatingRef.current = false;
      },
    );

    return () => {
      sizeAnimation.stop();
      enterAnimation?.stop();
      isAnimatingRef.current = false;
    };
  }, [step, reducedMotion]);

  return containerRef;
}

export function BookerSteps({
  step,
  children,
}: {
  step: BookerStep;
  children: ReactNode;
}) {
  const containerRef = useStepTransition(step);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user" transition={SIZE_TRANSITION}>
        <div
          ref={containerRef}
          className="relative w-full @3xl:flex-1 overflow-clip"
        >
          {children}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
