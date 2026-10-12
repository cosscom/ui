"use client";

import { CalendarIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import type { AgentStatus } from "@/registry/default/ui/agent-status-indicator";
import {
  AgentToolActivityGroup,
  AgentToolActivityRow,
} from "@/registry/default/ui/agent-tool-activity";
import { Button } from "@/registry/default/ui/button";

// These values illustrate a runtime mapping; the UI components do not depend on AI SDK.
type Step = { id: string; tool: string; state: string };
type Outcome = "running" | "complete" | "declined" | "failed" | "unknown";
const scenarios = [
  {
    name: "Running",
    steps: [
      { id: "calendar", tool: "check-calendar", state: "input-available" },
    ],
  },
  {
    name: "Completed",
    steps: [
      { id: "calendar", tool: "check-calendar", state: "output-available" },
      { id: "notice", tool: "check-notice", state: "output-available" },
    ],
  },
  {
    name: "Declined",
    steps: [{ id: "calendar", tool: "check-calendar", state: "output-denied" }],
  },
  {
    name: "Failed",
    steps: [{ id: "calendar", tool: "check-calendar", state: "output-error" }],
  },
  {
    name: "Mixed",
    steps: [
      { id: "notice", tool: "check-notice", state: "output-available" },
      { id: "calendar", tool: "check-calendar", state: "output-error" },
      { id: "team", tool: "check-team-calendar", state: "input-available" },
    ],
  },
  {
    name: "Unknown",
    steps: [
      {
        id: "external",
        tool: "external-calendar-check",
        state: "pending-review",
      },
      {
        id: "custom",
        tool: "custom-calendar-check",
        state: "output-available",
      },
    ],
  },
] satisfies [
  { name: string; steps: Step[] },
  ...{ name: string; steps: Step[] }[],
];
const tools: Record<
  string,
  { label: string; completed: string; icon: typeof CalendarIcon }
> = {
  "check-calendar": {
    label: "Check your calendar",
    completed: "Checked your calendar.",
    icon: CalendarIcon,
  },
  "check-team-calendar": {
    label: "Check team calendars",
    completed: "Checked team calendars.",
    icon: CalendarIcon,
  },
  "check-notice": {
    label: "Check minimum notice",
    completed: "Minimum notice is satisfied.",
    icon: ClockIcon,
  },
};
function outcome(state: string): Outcome {
  switch (state) {
    case "input-streaming":
    case "input-available":
      return "running";
    case "output-available":
      return "complete";
    case "output-denied":
      return "declined";
    case "output-error":
      return "failed";
    default:
      return "unknown";
  }
}
const outcomeLabels: Record<Outcome, string> = {
  running: "running",
  complete: "completed",
  declined: "declined",
  failed: "failed",
  unknown: "status unknown",
};

export default function Particle() {
  const [scenario, setScenario] = useState(scenarios[0]);
  const counts = scenario.steps.reduce<Record<Outcome, number>>(
    (result, step) => {
      result[outcome(step.state)] += 1;
      return result;
    },
    { running: 0, complete: 0, declined: 0, failed: 0, unknown: 0 },
  );
  const summary = (Object.keys(counts) as Outcome[])
    .filter((key) => counts[key] > 0)
    .map((key) => `${counts[key]} ${outcomeLabels[key]}`)
    .join(" · ");
  const status: AgentStatus = counts.running
    ? "working"
    : counts.failed
      ? "error"
      : counts.unknown
        ? "needs-input"
        : counts.declined
          ? "idle"
          : "complete";
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex min-h-36 flex-col gap-4">
        <p className="text-sm">
          I’ll check availability for your next meeting.
        </p>
        <AgentToolActivityGroup defaultOpen status={status} summary={summary}>
          {scenario.steps.map((step) => {
            const tool = tools[step.tool];
            const state = outcome(step.state);
            const Icon = tool?.icon;
            const label = tool?.label ?? step.tool;
            return (
              <AgentToolActivityRow
                icon={Icon ? <Icon /> : undefined}
                key={step.id}
              >
                {state === "running" ? (
                  <span className="animate-pulse motion-reduce:animate-none">
                    {label}…
                  </span>
                ) : state === "complete" ? (
                  (tool?.completed ?? `${label} — completed`)
                ) : state === "declined" ? (
                  <>
                    <span className="line-through">{label}</span>
                    <span className="text-muted-foreground"> — declined</span>
                  </>
                ) : state === "failed" ? (
                  <>
                    <span className="font-medium">{label} failed.</span>{" "}
                    <span className="text-muted-foreground">
                      Reconnect the calendar and try again.
                    </span>
                  </>
                ) : (
                  <>
                    {label}{" "}
                    <span className="text-muted-foreground">
                      — status unavailable
                    </span>
                  </>
                )}
              </AgentToolActivityRow>
            );
          })}
        </AgentToolActivityGroup>
      </div>
      <div
        aria-label="Example tool state"
        className="flex flex-wrap gap-1 border-t pt-3"
        role="group"
      >
        {scenarios.map((item) => (
          <Button
            aria-pressed={scenario.name === item.name}
            key={item.name}
            onClick={() => setScenario(item)}
            size="xs"
            type="button"
            variant="ghost"
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
