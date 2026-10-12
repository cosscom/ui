"use client";

import { useState } from "react";
import { AgentApprovalCard } from "@/registry/default/ui/agent-approval";
import { AgentStatusIndicator } from "@/registry/default/ui/agent-status-indicator";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [decision, setDecision] = useState<boolean | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <AgentApprovalCard
        approveLabel="Send email"
        context="To Alex Morgan"
        disabled={decision !== null}
        onRespond={setDecision}
        question="Send this follow-up?"
        rejectLabel="Skip"
      >
        <div className="flex flex-col gap-1.5 border-s-2 ps-3 text-sm">
          <p className="font-medium">Following up on our call</p>
          <p className="text-muted-foreground">
            Hi Alex, thanks for your time today. Are you free for a quick
            follow-up next week?
          </p>
        </div>
      </AgentApprovalCard>
      <div className="flex min-h-5 items-center" role="status">
        {decision !== null && (
          <AgentStatusIndicator
            announce={false}
            status={decision ? "complete" : "idle"}
            label={
              decision ? "You approved this email." : "You skipped this email."
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
