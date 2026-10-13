"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { ChatConversation } from "@/registry/default/chat/chat-conversation";
import { ChatDeliveryIndicator } from "@/registry/default/chat/chat-delivery-indicator";
import { ChatMessage } from "@/registry/default/chat/chat-message";
import { useChatScroll } from "@/registry/default/chat/hooks/use-chat-scroll";
import { ChatMemberAvatar } from "@/registry/default/chat-demo/chat-demo-message";
import { ChatTimelineState } from "@/registry/default/chat-demo/chat-demo-scenarios";
import {
  CHAT_MEMBERS,
  type MemberId,
} from "@/registry/default/chat-demo/chat-demo-state";
import {
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";
import { ChatInlineComposer } from "./chat-inline-composer";
import { cn } from "@/lib/utils";

type SampleMessage = { id: number; author: MemberId; text: string };

const SAMPLE_MESSAGES: SampleMessage[] = [
  { id: 1, author: "maya", text: "The new onboarding flow is up for review." },
  { id: 2, author: "jordan", text: "Looks great. The empty state is lovely." },
  { id: 3, author: "you", text: "Agreed. Let’s ship it on Friday." },
];

export function ChatWindow({
  title = "Design review",
  subtitle = "Maya, Jordan, Alex, and you",
  className,
  children,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden bg-popover",
        className,
      )}
    >
      <div className="shrink-0 border-b px-4 py-3">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="mt-0.5 text-muted-foreground text-xs">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function SampleConversation({
  banner,
  disabled = false,
  empty = false,
}: {
  banner?: ReactNode;
  disabled?: boolean;
  empty?: boolean;
}) {
  const [draft, setDraft] = useState<ComposerValue>([]);
  const [messages, setMessages] = useState<SampleMessage[]>(
    empty ? [] : SAMPLE_MESSAGES,
  );
  const nextId = useRef(SAMPLE_MESSAGES.length + 1);
  const scroll = useChatScroll({ itemCount: messages.length });

  return (
    <>
      {banner}
      <ChatConversation
        scroll={scroll}
        label="Messages"
        jumpLabel="Jump to latest"
      >
        {messages.length === 0 && (
          <ChatTimelineState
            scenario="empty"
            joined
            memberCount={3}
            onRecover={() => {}}
            onJoin={() => {}}
          />
        )}
        <div className="flex flex-col gap-4 pt-4">
          {messages.map((message) => (
            <SampleMessageRow
              key={message.id}
              message={message}
              animateEntrance={message.id > SAMPLE_MESSAGES.length}
            />
          ))}
        </div>
      </ChatConversation>
      <ChatInlineComposer
        disabled={disabled}
        value={draft}
        onValueChange={setDraft}
        onSubmit={(value) => {
          const text = getComposerText(value).trim();
          if (!text) return;
          const id = nextId.current++;
          scroll.atBottomRef.current = true;
          setMessages((current) => [...current, { id, author: "you", text }]);
          setDraft([]);
        }}
      />
    </>
  );
}

function SampleMessageRow({
  message,
  animateEntrance,
}: {
  message: SampleMessage;
  animateEntrance: boolean;
}) {
  const own = message.author === "you";
  return (
    <ChatMessage
      side={own ? "outgoing" : "incoming"}
      author={CHAT_MEMBERS[message.author].name}
      avatar={<ChatMemberAvatar member={message.author} />}
      animateEntrance={animateEntrance}
      footer={
        <span className="inline-flex items-center gap-1">
          10:42
          {own && <ChatDeliveryIndicator status="read" label="Read" />}
        </span>
      }
    >
      {message.text}
    </ChatMessage>
  );
}
