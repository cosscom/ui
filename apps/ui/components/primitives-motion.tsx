"use client";

import type { ReactNode } from "react";
import { BlueprintMotion } from "./blueprint-motion";
import { PrimitivesMorph } from "./primitives-morph";

export function PrimitivesMotion({ children }: { children: ReactNode }) {
  return (
    <BlueprintMotion
      renderAnimation={(paused) => <PrimitivesMorph paused={paused} />}
    >
      {children}
    </BlueprintMotion>
  );
}
