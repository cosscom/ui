"use client";

import { useState } from "react";
import { AgentApprovalCard } from "@/registry/default/ui/agent-approval";
import { AgentStatusIndicator } from "@/registry/default/ui/agent-status-indicator";
import { Button } from "@/registry/default/ui/button";

const details = ["With Alex Morgan", "Google Meet video call"];

export default function Particle() {
  const [decision, setDecision] = useState<boolean | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <AgentApprovalCard
        approveLabel="Create event"
        context="Tomorrow, 10:00–10:30 AM"
        details={details}
        disabled={decision !== null}
        onRespond={setDecision}
        question="Schedule a design review?"
        rejectLabel="Skip"
      />
      <div className="flex min-h-5 items-center" role="status">
        {decision !== null && (
          <AgentStatusIndicator
            announce={false}
            status={decision ? "complete" : "idle"}
            label={
              decision ? "You approved this event." : "You skipped this event."
            }
          />
        )}
      </div>
      <div className="flex justify-end border-t pt-3">
        <Button
          disabled={decision === null}
          onClick={() => setDecision(null)}
          size="xs"
          variant="ghost"
        >
          Reset demo
        </Button>
      </div>
    </div>
  );
}
