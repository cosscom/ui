"use client";

import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import {
  AgentMessageAction,
  AgentMessageActions,
  AgentMessageCopyAction,
} from "@/registry/default/ui/agent-message-actions";

const response =
  "Start with a 15-minute intro call. It gives you time to understand what someone needs before booking a longer session.";

export default function Particle() {
  const [saved, setSaved] = useState(false);

  return (
    <AgentMessage aria-label="Assistant" author="assistant">
      <AgentMessageContent>{response}</AgentMessageContent>
      <AgentMessageActions label="Suggestion actions">
        <AgentMessageCopyAction
          copiedLabel="Copied"
          copyLabel="Copy suggestion"
          errorLabel="Could not copy. Try again."
          text={response}
        />
        <AgentMessageAction
          aria-pressed={saved}
          label="Save suggestion"
          onClick={() => setSaved(!saved)}
        >
          <BookmarkIcon
            aria-hidden="true"
            className={saved ? "fill-current" : undefined}
          />
        </AgentMessageAction>
      </AgentMessageActions>
    </AgentMessage>
  );
}
