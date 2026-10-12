"use client";

import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import {
  AgentMessageActions,
  AgentMessageCopyAction,
} from "@/registry/default/ui/agent-message-actions";

const response =
  "Hi Sam,\n\nThanks for joining the demo today. I’ve attached a quick overview for your team. Let me know if you’d like to explore anything in more detail.";

export default function Particle() {
  return (
    <div className="flex w-full flex-col gap-8">
      <AgentMessage aria-label="You" author="user">
        <AgentMessageContent>
          Write a short follow-up email after a product demo.
        </AgentMessageContent>
      </AgentMessage>
      <AgentMessage aria-label="Assistant" author="assistant">
        <AgentMessageContent>
          <p>Hi Sam,</p>
          <p>
            Thanks for joining the demo today. I’ve attached a quick overview
            for your team. Let me know if you’d like to explore anything in more
            detail.
          </p>
        </AgentMessageContent>
        <AgentMessageActions alwaysVisible label="Response actions">
          <AgentMessageCopyAction
            copiedLabel="Copied"
            copyLabel="Copy response"
            errorLabel="Could not copy. Try again."
            text={response}
          />
        </AgentMessageActions>
      </AgentMessage>
    </div>
  );
}
