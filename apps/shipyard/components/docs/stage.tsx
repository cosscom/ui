import type { ReactNode } from "react";
import { Scene, type SceneName } from "./scenes";

// The landing page's stage: a quiet panel with one harbour drawing in it,
// beside whatever the reader should do first. Used once, on the introduction.
export function Stage({
  scene = "moored",
  title,
  children,
}: {
  scene?: SceneName;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="berth-stage">
      <div className="berth-stage-body">
        {title && <p className="berth-stage-title">{title}</p>}
        <div className="berth-stage-text">{children}</div>
      </div>
      <div aria-hidden="true" className="berth-stage-art">
        <Scene name={scene} width={232} />
      </div>
    </section>
  );
}
