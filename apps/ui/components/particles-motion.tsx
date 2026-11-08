"use client";

import type { ReactNode } from "react";
import { BlueprintMotion } from "./blueprint-motion";
import { ParticlesAssemblyDrawing } from "./particles-assembly-drawing";

export function ParticlesMotion({ children }: { children: ReactNode }) {
  return (
    <BlueprintMotion renderAnimation={() => <ParticlesAssemblyDrawing />}>
      {children}
    </BlueprintMotion>
  );
}
