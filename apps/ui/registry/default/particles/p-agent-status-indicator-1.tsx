"use client";

import { useState } from "react";
import {
  type AgentStatus,
  AgentStatusIndicator,
} from "@/registry/default/ui/agent-status-indicator";
import { Button } from "@/registry/default/ui/button";

const states = [
  { status: "idle", name: "Idle", label: "Ready to help" },
  { status: "thinking", name: "Thinking", label: "Thinking…" },
  { status: "working", name: "Working", label: "Checking calendars…" },
  {
    status: "needs-input",
    name: "Needs input",
    label: "Waiting for your approval",
  },
  { status: "complete", name: "Complete", label: "Calendars checked" },
  { status: "error", name: "Error", label: "Couldn’t check the calendar" },
] as const satisfies readonly {
  status: AgentStatus;
  name: string;
  label: string;
}[];

export default function Particle() {
  const [selected, setSelected] = useState<(typeof states)[number]>(states[1]);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex min-h-24 items-center justify-center">
        <AgentStatusIndicator label={selected.label} status={selected.status} />
      </div>
      <div
        aria-label="Example status"
        className="flex flex-wrap justify-center gap-1 border-t pt-3"
        role="group"
      >
        {states.map((state) => (
          <Button
            aria-pressed={selected.status === state.status}
            key={state.status}
            onClick={() => setSelected(state)}
            size="xs"
            type="button"
            variant="ghost"
          >
            {state.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
