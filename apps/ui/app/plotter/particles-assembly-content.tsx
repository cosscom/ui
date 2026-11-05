import type { ReactNode } from "react";

export type AssemblyScene = "workspace" | "booking" | "activity";

export function AssemblyContent({
  scene,
  part,
  trailingMotion,
  thumbMotion,
}: {
  scene: AssemblyScene;
  part: 0 | 1 | 2;
  trailingMotion?: ReactNode;
  thumbMotion?: ReactNode;
}) {
  const label = {
    workspace: ["Studio", "Public", "Open"],
    booking: ["Wed 28", "10:30", "Meet"],
    activity: ["", "", "Ready"],
  }[scene][part];
  const labelX = part === 0 || (scene === "booking" && part === 1) ? 40 : 14;

  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      <g strokeWidth="0.95">
        {scene === "workspace" && part === 0 && (
          <circle cx="22" cy="20" r="9" />
        )}
        {scene === "workspace" && part === 1 && (
          <g>
            {trailingMotion}
            <rect height="18" rx="9" width="30" x="76" y="11" />
            <circle cx="97" cy="20" r="5.5">
              {thumbMotion}
            </circle>
          </g>
        )}
        {scene === "booking" && part === 0 && (
          <rect height="16" rx="2" width="16" x="14" y="12" />
        )}
        {scene === "booking" && part === 1 && <circle cx="22" cy="20" r="8" />}
        {scene === "booking" && part === 2 && (
          <>
            <rect height="12" rx="2" width="14" x="86" y="14" />
            <path d="m100 18 7-4v12l-7-4" />
          </>
        )}
        {scene === "activity" && part === 0 && (
          <circle cx="24" cy="24" r="12" />
        )}
      </g>
      <g opacity="0.5" strokeWidth="0.65">
        {scene === "workspace" && part === 0 && <path d="M18 20h8 M22 16v8" />}
        {scene === "workspace" && part === 2 && (
          <g>
            {trailingMotion}
            <path d="M86 20h16 m-4.24-4.24L102 20l-4.24 4.24" />
          </g>
        )}
        {scene === "booking" && part === 0 && (
          <path d="M14 17h16 M18 10v5 M26 10v5 M18 21h4 M18 24h8" />
        )}
        {scene === "booking" && part === 1 && <path d="M22 15v5l4 2" />}
        {scene === "activity" && part === 0 && (
          <>
            <circle cx="24" cy="20" r="3.5" />
            <path d="M17 31a7 7 0 0 1 14 0" />
          </>
        )}
        {scene === "activity" && part === 2 && <path d="m12 16 3 3 6-6" />}
      </g>
      {scene === "activity" ? (
        <g fill="currentColor" stroke="none">
          {part === 1 && (
            <>
              <text fontSize="11" opacity="0.76" x="12" y="20">
                New reply
              </text>
              <text fontSize="10" opacity="0.52" x="12" y="35">
                Maya · just now
              </text>
            </>
          )}
          {part === 2 && (
            <text fontSize="11" opacity="0.76" x="27" y="20">
              Ready
            </text>
          )}
        </g>
      ) : (
        <text
          fill="currentColor"
          fontSize="11"
          opacity="0.76"
          stroke="none"
          x={labelX}
          y="24"
        >
          {label}
        </text>
      )}
    </g>
  );
}
