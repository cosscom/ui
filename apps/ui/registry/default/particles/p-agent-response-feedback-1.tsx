"use client";

import { useState } from "react";
import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import { AgentResponseFeedback } from "@/registry/default/ui/agent-response-feedback";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [failNext, setFailNext] = useState(false);
  return (
    <div className="flex w-full flex-col gap-6">
      <AgentMessage aria-label="Assistant" author="assistant" className="gap-2">
        <AgentMessageContent>
          You’re free tomorrow at 2:00 PM for a 30-minute meeting.
        </AgentMessageContent>
        <AgentResponseFeedback
          labels={{
            goodResponse: "Good response",
            badResponse: "Bad response",
            dialogTitle: "What could be better?",
            dialogDescription:
              "Share what went wrong. Reasons and details are optional.",
            reasonPrompt: "What was the issue?",
            details: "Additional details",
            detailsPlaceholder: "Tell us more…",
            cancel: "Cancel",
            submit: "Send feedback",
            submitError: "Couldn’t save your feedback. Please try again.",
            thankYou: "Thanks for your feedback.",
          }}
          reasons={[
            { value: "incorrect", label: "Incorrect" },
            { value: "unclear", label: "Unclear" },
            { value: "unhelpful", label: "Not helpful" },
          ]}
          onFeedback={async () => {
            await new Promise((resolve) => setTimeout(resolve, 700));
            if (failNext) {
              setFailNext(false);
              throw new Error("Demo failure");
            }
          }}
        />
      </AgentMessage>
      <div className="flex justify-end border-t pt-3">
        <Button
          aria-pressed={failNext}
          onClick={() => setFailNext((value) => !value)}
          size="xs"
          variant="ghost"
        >
          {failNext ? "Next save will fail" : "Fail next save"}
        </Button>
      </div>
    </div>
  );
}
