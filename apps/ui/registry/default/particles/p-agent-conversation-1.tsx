"use client";

import { useState } from "react";
import {
  AgentConversation,
  AgentConversationTimestamp,
} from "@/registry/default/ui/agent-conversation";
import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import { Button } from "@/registry/default/ui/button";

const messages = [
  {
    id: "request",
    author: "user",
    text: "Find a time for a 30-minute call with Sam next week.",
  },
  {
    id: "options",
    author: "assistant",
    text: "You’re both free on Tuesday at 10:00 and Thursday at 14:00.",
  },
  {
    id: "choice",
    author: "user",
    text: "Tuesday works. Let’s use a video call.",
  },
  {
    id: "summary",
    author: "assistant",
    text: "Tuesday at 10:00, for 30 minutes, with Sam. I’ll include a video link.",
  },
  {
    id: "agenda",
    author: "user",
    text: "Add a short agenda: introductions, a product walkthrough, and questions.",
  },
  {
    id: "reply",
    author: "assistant",
    text: "Here’s the agenda:\n\n• Introductions — 5 minutes\n• Product walkthrough — 15 minutes\n• Questions — 10 minutes",
  },
] as const;

export default function Particle() {
  const [showReply, setShowReply] = useState(false);
  const [revision, setRevision] = useState(0);

  return (
    <div className="flex w-full flex-col gap-4">
      <AgentConversation
        className="h-72"
        key={revision}
        label="Scheduling conversation"
        scrollToLatestLabel="Scroll to latest message"
      >
        <AgentConversationTimestamp dateTime="2026-09-21">
          Today
        </AgentConversationTimestamp>
        {messages.slice(0, showReply ? 6 : 5).map((message) => (
          <AgentMessage
            aria-label={message.author === "user" ? "You" : "Assistant"}
            author={message.author}
            key={message.id}
          >
            <AgentMessageContent className="whitespace-pre-wrap">
              {message.text}
            </AgentMessageContent>
          </AgentMessage>
        ))}
      </AgentConversation>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <Button
          disabled={showReply}
          onClick={() => setShowReply(true)}
          size="xs"
          variant="outline"
        >
          Add reply
        </Button>
        <Button
          onClick={() => {
            setShowReply(false);
            setRevision((value) => value + 1);
          }}
          size="xs"
          variant="ghost"
        >
          Reset demo
        </Button>
      </div>
    </div>
  );
}
