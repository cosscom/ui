import type { ReactNode } from "react";

/**
 * The Booker's right-hand side: one step at a time. `step` is any key that
 * names what is shown; a change of key is a change of step, and the
 * children are the current step's content, keyed by `step`. Steps swap
 * instantly; there is no animation for now.
 */
export function BookerSteps({
  step,
  children,
}: {
  step: string;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full @3xl:flex-1 overflow-clip">
      <div key={step}>{children}</div>
    </div>
  );
}
