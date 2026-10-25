import type { ReactNode } from "react";

// Construction finishes during the first second of each 2.4s hold. Reset only
// after its parent is hidden, so subsequent cycles never flash the final state.
export function ConstructionMotion({
  attributeName,
  delay = 0.12,
  duration = 0.68,
  from,
  stage,
  to,
  type,
}: {
  attributeName: string;
  delay?: number;
  duration?: number;
  from: string | number;
  stage: number;
  to: string | number;
  type?: "rotate";
}) {
  const timing = {
    attributeName,
    begin: `${stage * 3.2}s`,
    calcMode: "spline" as const,
    dur: "12.8s",
    keySplines: "0 0 1 1;0.22 0 0.12 1;0 0 1 1;0 0 1 1;0 0 1 1",
    keyTimes: [
      0,
      delay / 12.8,
      (delay + duration) / 12.8,
      2.45 / 12.8,
      2.5 / 12.8,
      1,
    ].join(";"),
    repeatCount: "indefinite",
    values: [from, from, to, to, from, from].join(";"),
  };

  return type ? (
    <animateTransform {...timing} type={type} />
  ) : (
    <animate {...timing} />
  );
}

export function ConstructionAnnotation({
  children,
  stage,
}: {
  children: ReactNode;
  stage: number;
}) {
  return (
    <g opacity="0">
      <ConstructionMotion
        attributeName="opacity"
        delay={0.78}
        duration={0.16}
        from={0}
        stage={stage}
        to={1}
      />
      {children}
    </g>
  );
}
