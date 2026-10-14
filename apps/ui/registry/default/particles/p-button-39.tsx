"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [open, setOpen] = useState(false);

  return (
    <Button
      aria-label="Toggle hamburger icon animation"
      aria-pressed={open}
      onClick={() => setOpen((prevState) => !prevState)}
      size="icon"
      variant="outline"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none"
        fill="none"
        height={16}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={16}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="origin-center in-[[data-slot=button][aria-pressed=true]]:translate-x-0 -translate-y-[7px] in-[[data-slot=button][aria-pressed=true]]:translate-y-0 in-[[data-slot=button][aria-pressed=true]]:rotate-315 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
          d="M4 12L20 12"
        />
        <path
          className="origin-center in-[[data-slot=button][aria-pressed=true]]:rotate-45 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
          d="M4 12H20"
        />
        <path
          className="origin-center in-[[data-slot=button][aria-pressed=true]]:translate-y-0 translate-y-[7px] in-[[data-slot=button][aria-pressed=true]]:rotate-135 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
          d="M4 12H20"
        />
      </svg>
    </Button>
  );
}
