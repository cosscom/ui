"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/registry/default/ui/badge";

export default function Particle() {
  const [isActive, setIsActive] = useState(true);

  if (!isActive) return null;

  return (
    <Badge className="gap-0">
      Removable
      <button
        aria-label="Remove badge"
        className="-my-px -ms-px -me-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 text-primary-foreground/60 outline-none transition-[color,box-shadow] hover:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onClick={() => setIsActive(false)}
        type="button"
      >
        <XIcon aria-hidden="true" />
      </button>
    </Badge>
  );
}
