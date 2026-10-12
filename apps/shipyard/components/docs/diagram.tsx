import {
  Children,
  type CSSProperties,
  isValidElement,
  type ReactNode,
} from "react";

// Diagrams in the landing page's language ("How it works", site/index.html):
// neutral cards on a quiet ground, joined by ropes, with the details of a
// link as small chips. Real HTML text, so it reads, wraps, selects and
// translates; the line work is inline SVG and CSS. A row on a wide column,
// a stack on a narrow one (a container query, diagram.css).
//
//   <Diagram caption="What the picture says, in one or two sentences.">
//     <DiagramGroup label="Your laptop" icon="laptop">
//       <DiagramNode title="Clients">
//         - Desktop app
//       </DiagramNode>
//       <DiagramEdge label="Local API" details={['Unix socket']} line="solid" />
//       <DiagramNode title="berth agent" />
//     </DiagramGroup>
//     <DiagramEdge label="TLS 1.3, HTTP/2" details={['pinned keys']} />
//     <DiagramGroup label="Each box" icon="box">…</DiagramGroup>
//   </Diagram>
//
// Children run in order, left to right (top to bottom when stacked). Edges
// point from the thing before them to the thing after.

type Icon = "laptop" | "box";

const glyphs: Record<Icon, ReactNode> = {
  laptop: (
    <>
      <rect x="3.5" y="4" width="13" height="9" rx="1.5" />
      <path d="M1.5 15.5h17" />
    </>
  ),
  box: (
    <>
      <rect x="3" y="3.5" width="14" height="5.5" rx="1.5" />
      <rect x="3" y="11" width="14" height="5.5" rx="1.5" />
      <path d="M6.5 6.25h.01M6.5 13.75h.01" strokeWidth="2.2" />
    </>
  ),
};

function Glyph({ name }: { name: Icon }) {
  return (
    <svg
      className="berth-dg-glyph"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphs[name]}
    </svg>
  );
}

export function Diagram({
  caption,
  children,
}: {
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="berth-dg not-prose">
      <div className="berth-dg-panel">
        <div className="berth-dg-flow">{children}</div>
      </div>
      <figcaption className="berth-dg-caption">{caption}</figcaption>
    </figure>
  );
}

// A place things run (a laptop, a box): a labelled region around its nodes.
export function DiagramGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: Icon;
  children: ReactNode;
}) {
  const kids = Children.toArray(children).filter(isValidElement);
  // Nodes share the row's spare width evenly, so a group grows by its nodes
  // and keeps room for the edges inside it.
  const style = {
    "--dg-nodes": Math.max(
      1,
      kids.filter((k) => k.type === DiagramNode).length,
    ),
    "--dg-edges": kids.filter((k) => k.type === DiagramEdge).length,
  } as CSSProperties;
  return (
    <div
      className="berth-dg-group"
      role="group"
      aria-label={label}
      style={style}
    >
      <p className="berth-dg-group-label" aria-hidden="true">
        {icon && <Glyph name={icon} />}
        {label}
      </p>
      <div className="berth-dg-group-flow">{children}</div>
    </div>
  );
}

// One component: a title, an optional line under it, and what it does as a
// short Markdown list.
export function DiagramNode({
  title,
  sub,
  children,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="berth-dg-node">
      <p className="berth-dg-title">{title}</p>
      {sub && <p className="berth-dg-sub">{sub}</p>}
      {children && <div className="berth-dg-body">{children}</div>}
    </div>
  );
}

// A link from the thing before it to the thing after it. A rope (dashes that
// travel, the landing page's) is a network connection; a solid line is a
// local one.
export function DiagramEdge({
  label,
  details = [],
  line = "rope",
}: {
  label: string;
  details?: string[];
  line?: "rope" | "solid";
}) {
  return (
    <div className="berth-dg-edge" data-line={line}>
      <span className="berth-dg-edge-label">
        <span className="sr-only">Connected by </span>
        {label}
        {details.length > 0 && (
          <span className="sr-only">: {details.join(", ")}.</span>
        )}
      </span>
      <span className="berth-dg-rope" aria-hidden="true">
        <span className="berth-dg-rope-line" />
        <svg
          className="berth-dg-arrow"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 1.5 7.5 5 3 8.5" />
        </svg>
      </span>
      {details.length > 0 && (
        <span className="berth-dg-chips" aria-hidden="true">
          {details.map((d) => (
            <span key={d} className="berth-dg-chip">
              {d}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
