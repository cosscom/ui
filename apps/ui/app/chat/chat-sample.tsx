"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ChatCollapsibleMessage } from "@/registry/default/chat/chat-collapsible-message";
import { ChatConversation } from "@/registry/default/chat/chat-conversation";
import { ChatDeliveryIndicator } from "@/registry/default/chat/chat-delivery-indicator";
import { ChatMessage } from "@/registry/default/chat/chat-message";
import { ChatMessageText } from "@/registry/default/chat/chat-message-text";
import { useChatScroll } from "@/registry/default/chat/hooks/use-chat-scroll";
import { ChatDemoComposer } from "@/registry/default/chat-demo/chat-demo-composer";
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
      <div className="shrink-0 px-4 py-3">
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
  focusComposer = false,
  notice = "",
}: {
  banner?: ReactNode;
  disabled?: boolean;
  empty?: boolean;
  focusComposer?: boolean;
  notice?: string;
}) {
  const [draft, setDraft] = useState<ComposerValue>([]);
  const [messages, setMessages] = useState<SampleMessage[]>(
    empty ? [] : SAMPLE_MESSAGES,
  );
  const inputRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusComposer && !disabled)
      inputRef.current?.focus({ preventScroll: true });
  }, [focusComposer, disabled]);
  const nextId = useRef(SAMPLE_MESSAGES.length + 1);
  const scroll = useChatScroll({ itemCount: messages.length });

  return (
    <>
      {banner}
      <ChatConversation
        scroll={scroll}
        label="Messages"
        jumpLabel="Jump to latest"
        contentClassName={
          messages.length === 0 ? "flex min-h-full flex-col" : undefined
        }
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
        {messages.length > 0 && (
          <div className="flex flex-col pt-4">
            {messages.map((message, index) => {
              const previous = messages[index - 1];
              const grouped = previous?.author === message.author;
              return (
                <div
                  key={message.id}
                  className={cn(
                    index > 0 &&
                      (grouped
                        ? previous.author === "you"
                          ? "pt-3"
                          : "pt-1"
                        : "pt-5"),
                  )}
                >
                  <SampleMessageRow
                    message={message}
                    grouped={grouped}
                    groupEnd={messages[index + 1]?.author !== message.author}
                    animateEntrance={message.id > SAMPLE_MESSAGES.length}
                  />
                </div>
              );
            })}
          </div>
        )}
      </ChatConversation>
      <ChatDemoComposer
        inputRef={inputRef}
        mentionMembers={["maya", "jordan", "alex"]}
        notice={notice}
        disabled={disabled}
        value={draft}
        onValueChange={setDraft}
        onSend={() => {
          const text = getComposerText(draft).trim();
          if (!text || disabled) return;
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
  grouped,
  groupEnd,
}: {
  message: SampleMessage;
  animateEntrance: boolean;
  grouped: boolean;
  groupEnd: boolean;
}) {
  const own = message.author === "you";
  return (
    <ChatMessage
      side={own ? "outgoing" : "incoming"}
      author={CHAT_MEMBERS[message.author].name}
      avatar={<ChatMemberAvatar member={message.author} />}
      animateEntrance={animateEntrance}
      grouped={grouped}
      footer={
        groupEnd || own ? (
          <>
            <time>10:42</time>
            {own && <ChatDeliveryIndicator status="read" label="Read" />}
          </>
        ) : undefined
      }
    >
      <ChatCollapsibleMessage
        text={message.text}
        side={own ? "outgoing" : "incoming"}
        showMoreLabel="Show more"
        showLessLabel="Show less"
        renderText={(text) => (
          <ChatMessageText
            text={text}
            mentions={Object.values(CHAT_MEMBERS).map(
              (member) => member.handle,
            )}
          />
        )}
      />
    </ChatMessage>
  );
}
