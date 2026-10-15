"use client";

import { CheckIcon } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/registry/default/ui/badge";
import { Checkbox } from "@/registry/default/ui/checkbox";

export default function Particle() {
  const id = useId();
  return (
    <Badge className="relative outline-none has-data-unchecked:bg-muted has-data-unchecked:text-muted-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-1 has-focus-visible:ring-offset-background">
      <Checkbox className="peer sr-only absolute" defaultChecked id={id} />
      <CheckIcon
        aria-hidden="true"
        className="hidden peer-data-checked:block"
      />
      <label
        className="cursor-pointer select-none after:absolute after:inset-0"
        htmlFor={id}
      >
        Selectable
      </label>
    </Badge>
  );
}
