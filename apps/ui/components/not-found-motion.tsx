"use client";

import type { ReactNode } from "react";
import { BlueprintMotion } from "./blueprint-motion";
import { NotFoundBlueprint } from "./not-found-blueprint";

export function NotFoundMotion({ children }: { children: ReactNode }) {
  return (
    <BlueprintMotion renderAnimation={() => <NotFoundBlueprint animated />}>
      {children}
    </BlueprintMotion>
  );
}
