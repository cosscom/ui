"use client";

import { useId, useRef, useState } from "react";
import {
  AgentActionBar,
  AgentActionBarLauncher,
} from "@/registry/default/ui/agent-action-bar";
import { AgentComposer } from "@/registry/default/ui/agent-composer";
import { AgentConversation } from "@/registry/default/ui/agent-conversation";
import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import { AgentPanel } from "@/registry/default/ui/agent-panel";

export default function Particle() {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const launcher = useRef<HTMLButtonElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  function hidePanel() {
    setOpen(false);
    launcher.current?.focus();
  }
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="h-[480px] rounded-xl border bg-background">
        {open ? (
          <AgentPanel
            className="h-full"
            id={id}
            title="Assistant"
            labels={{
              close: "Close assistant",
              minimize: "Minimize assistant",
              openFullPage: "Open full page",
            }}
            onClose={hidePanel}
            onMinimize={hidePanel}
            composer={
              <AgentComposer
                value={draft}
                onValueChange={setDraft}
                onSubmit={(value) => {
                  setMessages((items) => [
                    ...items,
                    { id: crypto.randomUUID(), text: value },
                  ]);
                  setDraft("");
                }}
                onStop={() => {}}
                inputLabel="Message"
                sendLabel="Send message"
                stopLabel="Stop response"
                textareaProps={{
                  ref: textarea,
                  placeholder: "Ask a follow-up…",
                  rows: 3,
                }}
              />
            }
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <AgentConversation
                className="flex-1"
                contentClassName="px-4 pt-4 pb-8"
                scrollbarGutter
                label="Messages"
                scrollToLatestLabel="Jump to latest"
              >
                <AgentMessage aria-label="You" author="user">
                  <AgentMessageContent>
                    Find 30 minutes tomorrow.
                  </AgentMessageContent>
                </AgentMessage>
                <AgentMessage aria-label="Assistant" author="assistant">
                  <AgentMessageContent>
                    You’re free at 2:00 PM. Would you like to use that time?
                  </AgentMessageContent>
                </AgentMessage>
                {messages.map((message) => (
                  <AgentMessage aria-label="You" author="user" key={message.id}>
                    <AgentMessageContent className="whitespace-pre-wrap">
                      {message.text}
                    </AgentMessageContent>
                  </AgentMessage>
                ))}
              </AgentConversation>
            </div>
          </AgentPanel>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Open the assistant to continue.
          </div>
        )}
      </div>
      <AgentActionBar aria-label="Assistant controls">
        <AgentActionBarLauncher
          ref={launcher}
          aria-controls={open ? id : undefined}
          aria-expanded={open}
          onClick={() => {
            setOpen(true);
            requestAnimationFrame(() => textarea.current?.focus());
          }}
        >
          Assistant
        </AgentActionBarLauncher>
      </AgentActionBar>
    </div>
  );
}
