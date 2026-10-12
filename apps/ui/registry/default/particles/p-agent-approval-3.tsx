"use client";

import { useState } from "react";
import { AgentApprovalGroupCard } from "@/registry/default/ui/agent-approval";
import { AgentStatusIndicator } from "@/registry/default/ui/agent-status-indicator";
import { Button } from "@/registry/default/ui/button";

const items = [
  { id: "intro-call", title: "Intro call", context: "15 minutes · Video call" },
  {
    id: "product-demo",
    title: "Product demo",
    context: "30 minutes · Video call",
  },
];

export default function Particle() {
  const [decision, setDecision] = useState<{
    ids: string[];
    approved: boolean;
  } | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <AgentApprovalGroupCard
        approveLabel="Create both"
        disabled={decision !== null}
        items={items}
        onRespond={(ids, approved) => setDecision({ ids, approved })}
        question="Create these event types?"
        rejectLabel="Skip both"
      />
      <div className="flex min-h-5 items-center" role="status">
        {decision && (
          <AgentStatusIndicator
            announce={false}
            status={decision.approved ? "complete" : "idle"}
            label={`You ${decision.approved ? "approved" : "skipped"} ${decision.ids.length} event types.`}
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
