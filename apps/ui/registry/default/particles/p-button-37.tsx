"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [open, setOpen] = useState(false);

  return (
    <Button
      aria-label="Toggle plus icon animation"
      aria-pressed={open}
      className="rounded-full before:rounded-full"
      onClick={() => setOpen((prevState) => !prevState)}
      size="icon"
      variant="outline"
    >
      <PlusIcon
        aria-hidden="true"
        className="in-[[aria-pressed=true]]:rotate-[135deg] transition-transform duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
      />
    </Button>
  );
}
