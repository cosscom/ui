"use client";

import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SIZE_TRANSITION: KeyframeAnimationOptions = {
  duration: 300,
  easing: EASE,
};
// `backwards` holds the first frame during the delay, so the entering step
// is hidden from the first paint.
const ENTER_TRANSITION: KeyframeAnimationOptions = {
  delay: 50,
  duration: 400,
  easing: EASE,
  fill: "backwards",
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Size = { width: number; height: number };

const measure = (element: HTMLElement): Size => ({
  width: element.offsetWidth,
  height: element.offsetHeight,
});

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useStepTransition(step: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(step);
  const restingSizeRef = useRef<Size | null>(null);
  const isAnimatingRef = useRef(false);

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

    const start = restingSizeRef.current ?? measure(container);
    const end = measure(container);
    if (prefersReducedMotion()) {
      restingSizeRef.current = end;
      return;
    }

    // The entering step keeps its final width while the card resizes, so its
    // content does not reflow during the transition.
    const enteringStep = container.firstElementChild as HTMLElement | null;
    if (enteringStep) enteringStep.style.width = `${end.width}px`;

    isAnimatingRef.current = true;
    const sizeAnimation = container.animate(
      [
        { height: `${start.height}px`, width: `${start.width}px` },
        { height: `${end.height}px`, width: `${end.width}px` },
      ],
      SIZE_TRANSITION,
    );
    const enterAnimation = enteringStep?.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      ENTER_TRANSITION,
    );

    const settle = () => {
      enteringStep?.style.removeProperty("width");
      isAnimatingRef.current = false;
    };

    Promise.all([sizeAnimation.finished, enterAnimation?.finished]).then(
      () => {
        settle();
        restingSizeRef.current = measure(container);
      },
      // Cancelled by the next step change; the cleanup below has settled.
      () => {},
    );

    return () => {
      sizeAnimation.cancel();
      enterAnimation?.cancel();
      settle();
    };
  }, [step]);

  return containerRef;
}

/**
 * Animates the Booker's right-hand side between steps: the card resizes to
 * the new step and the new step fades in. `step` is any key that names what
 * is shown; a change of key is a change of step. The children are the
 * current step's content; BookerSteps keys them by `step` itself. Uses the
 * browser's Web Animations API, and switches instantly when the visitor
 * prefers reduced motion.
 */
export function BookerSteps({
  step,
  children,
}: {
  step: string;
  children: ReactNode;
}) {
  const containerRef = useStepTransition(step);

  return (
    <div
      ref={containerRef}
      className="relative w-full @3xl:flex-1 overflow-clip"
    >
      <div key={step}>{children}</div>
    </div>
  );
}
