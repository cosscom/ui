"use client";

import { DefaultChatTransport, type UIMessage } from "ai";
import { useRef, useState } from "react";
import AgentChat from "@/registry/default/blocks/agent-chat/agent-chat";
import { Button } from "@/registry/default/ui/button";

const initialMessages: UIMessage[] = [
  {
    id: "prompt",
    role: "user",
    parts: [
      { type: "text", text: "Write a short reminder for tomorrow’s meeting." },
    ],
  },
  {
    id: "reply",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi Alex,\n\nJust a quick reminder about our meeting tomorrow at 10 AM. Let me know if you need to reschedule.\n\nSee you then!",
      },
    ],
  },
];

export default function Particle() {
  const [revision, setRevision] = useState(0);
  const [failNext, setFailNext] = useState(false);
  const failRef = useRef(false);
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/agent-chat-demo`,
        fetch: (url, init) => {
          const demoFailure = failRef.current;
          failRef.current = false;
          setFailNext(false);
          return fetch(url, {
            ...init,
            body: JSON.stringify({
              ...JSON.parse(String(init?.body)),
              demoFailure,
            }),
          });
        },
      }),
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <AgentChat
        initialDraft="Make it a little warmer."
        initialMessages={initialMessages}
        key={revision}
        transport={transport}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <p className="text-muted-foreground text-xs">
          Sample responses · No model connected
        </p>
        <div className="flex items-center gap-1">
          <Button
            aria-pressed={failNext}
            onClick={() => {
              failRef.current = !failRef.current;
              setFailNext(failRef.current);
            }}
            size="xs"
            type="button"
            variant="ghost"
          >
            {failNext ? "Next response will fail" : "Try an error"}
          </Button>
          <Button
            onClick={() => {
              failRef.current = false;
              setFailNext(false);
              setRevision((value) => value + 1);
            }}
            size="xs"
            type="button"
            variant="ghost"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
