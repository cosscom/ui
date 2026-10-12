"use client";

import { useState } from "react";
import { AgentReasoning } from "@/registry/default/ui/agent-reasoning";
import { Button } from "@/registry/default/ui/button";

const steps = [
  "I’ll look for a time when everyone is free.",
  "I’ll look for a time when everyone is free.\nI’ll allow 30 minutes for the meeting.",
  "I’ll look for a time when everyone is free.\nI’ll allow 30 minutes for the meeting.\nTomorrow afternoon has a matching slot.",
];

export default function Particle() {
  const [step, setStep] = useState(0);
  const isStreaming = step < steps.length - 1;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="min-h-36">
        <AgentReasoning
          completedLabel="Considered availability"
          isStreaming={isStreaming}
          streamingLabel="Considering availability…"
        >
          {steps[step]}
        </AgentReasoning>
      </div>
      <div className="flex items-center gap-2 border-t pt-3">
        <Button
          onClick={() => setStep((value) => value + 1)}
          disabled={!isStreaming}
          size="xs"
          variant="outline"
        >
          {step === 0 ? "Add detail" : "Finish"}
        </Button>
        <Button
          onClick={() => setStep(0)}
          disabled={step === 0}
          size="xs"
          variant="ghost"
        >
          Restart
        </Button>
      </div>
    </div>
  );
}
