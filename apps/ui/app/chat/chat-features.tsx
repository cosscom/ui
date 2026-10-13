"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ChatCollapsibleMessage } from "@/registry/default/chat/chat-collapsible-message";
import { ChatConversation } from "@/registry/default/chat/chat-conversation";
import { ChatDatePill } from "@/registry/default/chat/chat-date-pill";
import { ChatDeliveryIndicator } from "@/registry/default/chat/chat-delivery-indicator";
import { ChatMessage } from "@/registry/default/chat/chat-message";
import { ChatMessageActionToolbar } from "@/registry/default/chat/chat-message-actions";
import { ChatMessageText } from "@/registry/default/chat/chat-message-text";
import { ChatReactionChip } from "@/registry/default/chat/chat-reaction-chip";
import { ChatReactionPicker } from "@/registry/default/chat/chat-reaction-picker";
import { ChatReplyReference } from "@/registry/default/chat/chat-reply-reference";
import { ChatUnreadDivider } from "@/registry/default/chat/chat-unread-divider";
import { useChatScroll } from "@/registry/default/chat/hooks/use-chat-scroll";
import { ChatDemoComposer } from "@/registry/default/chat-demo/chat-demo-composer";
import { ChatMemberAvatar } from "@/registry/default/chat-demo/chat-demo-message";
import {
  CHAT_EMOJI,
  CHAT_MEMBERS,
  type MemberId,
} from "@/registry/default/chat-demo/chat-demo-state";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardPanel,
} from "@/registry/default/ui/card";
import {
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";
import { cn } from "@/lib/utils";

function FeatureTile({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <CardFrame
      className={cn(
        "after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/64",
        className,
      )}
      render={<article />}
    >
      <Card className="flex-1">
        <CardPanel className="flex min-h-72 flex-col justify-center p-5">
          {children}
        </CardPanel>
      </Card>
      <CardFrameFooter className="px-5">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </CardFrameFooter>
    </CardFrame>
  );
}

function RepliesDemo() {
  const [highlighted, setHighlighted] = useState(false);
  const targetRef = useRef<HTMLElement>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="flex flex-col gap-4">
      <ChatMessage
        side="incoming"
        author={CHAT_MEMBERS.maya.name}
        avatar={<ChatMemberAvatar member="maya" />}
        highlighted={highlighted}
        ref={targetRef}
        tabIndex={-1}
        aria-label="Maya Chen, original message"
      >
        Can we move the launch to Thursday?
      </ChatMessage>
      <ChatMessage side="outgoing">
        <ChatReplyReference
          author={CHAT_MEMBERS.maya.name}
          preview="Can we move the launch to Thursday?"
          onClick={() => {
            targetRef.current?.focus({ preventScroll: true });
            setHighlighted(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setHighlighted(false), 420);
          }}
        />
        <ChatMessageText text="Thursday works. I’ll update the plan." />
      </ChatMessage>
    </div>
  );
}

const INITIAL_REACTIONS = [
  { emoji: "🎉", members: ["maya", "jordan"] as MemberId[] },
  { emoji: "❤️", members: ["alex"] as MemberId[] },
];

function ReactionsDemo() {
  const [reactions, setReactions] = useState(INITIAL_REACTIONS);
  const toggle = (emoji: string) => {
    setReactions((current) => {
      const existing = current.find((reaction) => reaction.emoji === emoji);
      if (!existing) return [...current, { emoji, members: ["you"] }];
      const members = existing.members.includes("you")
        ? existing.members.filter((member) => member !== "you")
        : [...existing.members, "you" as const];
      return current
        .map((reaction) =>
          reaction.emoji === emoji ? { ...reaction, members } : reaction,
        )
        .filter((reaction) => reaction.members.length > 0);
    });
  };

  return (
    <ChatMessage
      side="incoming"
      author={CHAT_MEMBERS.jordan.name}
      avatar={<ChatMemberAvatar member="jordan" />}
      actions={
        <ChatMessageActionToolbar
          side="incoming"
          toolbarLabel="Message actions"
          reactionPicker={(toolbarRef) => (
            <ChatReactionPicker
              inToolbar
              options={CHAT_EMOJI}
              selectedEmojis={reactions
                .filter((reaction) => reaction.members.includes("you"))
                .map((reaction) => reaction.emoji)}
              triggerLabel="Add reaction"
              triggerTooltip="React"
              popupLabel="Reactions"
              popupAnchor={toolbarRef}
              popupAlign="end"
              onSelect={toggle}
            />
          )}
        />
      }
      reactions={reactions.map((reaction) => {
        const selected = reaction.members.includes("you");
        return (
          <ChatReactionChip
            key={reaction.emoji}
            animateEntrance={
              !INITIAL_REACTIONS.some((item) => item.emoji === reaction.emoji)
            }
            emoji={reaction.emoji}
            count={reaction.members.length}
            selected={selected}
            label={`${selected ? "Remove" : "Add"} ${reaction.emoji} reaction, ${reaction.members.length} ${reaction.members.length === 1 ? "person" : "people"}`}
            reactorLabel={`${reaction.members.length} ${reaction.members.length === 1 ? "reaction" : "reactions"}`}
            popupAlign="start"
            onClick={() => toggle(reaction.emoji)}
            reactorContent={
              <ul
                aria-label="People who reacted"
                className="flex max-h-48 flex-col overflow-y-auto overscroll-contain"
              >
                {reaction.members.map((member) => (
                  <li
                    key={member}
                    className="flex items-center gap-2 px-1.5 py-1 text-xs leading-5"
                  >
                    <ChatMemberAvatar
                      member={member}
                      className="size-5 text-[.5625rem]"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {CHAT_MEMBERS[member].name}
                    </span>
                    {member === "you" && (
                      <Badge variant="secondary" size="sm">
                        You
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            }
          />
        );
      })}
    >
      We just crossed 10,000 signups 🚀
    </ChatMessage>
  );
}

function MentionsDemo() {
  const [draft, setDraft] = useState<ComposerValue>([]);
  const [sent, setSent] = useState("Thanks @Alex, this is exactly it.");
  const inputRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col gap-4">
      <ChatMessage side="outgoing">
        <ChatCollapsibleMessage
          text={sent}
          side="outgoing"
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
      <ChatDemoComposer
        className="px-0 pb-0"
        value={draft}
        onValueChange={setDraft}
        inputRef={inputRef}
        mentionMembers={["maya", "jordan", "alex"]}
        notice=""
        onSend={() => {
          const text = getComposerText(draft).trim();
          if (!text) return;
          setSent(text);
          setDraft([]);
        }}
      />
    </div>
  );
}

type Delivery = "sending" | "sent" | "delivered" | "read" | "failed";

const DELIVERY_LABELS: Record<Delivery, string> = {
  sending: "Sending…",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Not sent",
};

function DeliveryDemo() {
  const [failed, setFailed] = useState<Delivery>("failed");
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) window.clearTimeout(timer);
    };
  }, []);

  const retry = () => {
    setFailed("sending");
    timers.current.push(window.setTimeout(() => setFailed("delivered"), 900));
    timers.current.push(window.setTimeout(() => setFailed("read"), 1800));
  };

  const rows: { id: string; text: string; status: Delivery }[] = [
    { id: "read", text: "Draft is in the doc.", status: "read" },
    { id: "delivered", text: "Comments welcome.", status: "delivered" },
    { id: "retry", text: "Sharing it with the team now.", status: failed },
  ];

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <ChatMessage
          key={row.id}
          side="outgoing"
          grouped={row.id !== "read"}
          footer={
            <span className="inline-flex items-center gap-1.5">
              <ChatDeliveryIndicator
                status={row.status}
                label={DELIVERY_LABELS[row.status]}
              />
              <span
                className={cn(row.status === "failed" && "text-destructive")}
              >
                {DELIVERY_LABELS[row.status]}
              </span>
              {row.status === "failed" && (
                <Button
                  className="-my-1"
                  size="xs"
                  variant="ghost"
                  onClick={retry}
                >
                  Retry
                </Button>
              )}
            </span>
          }
        >
          {row.text}
        </ChatMessage>
      ))}
    </div>
  );
}

const LONG_MESSAGE = `Quick recap from today’s review.

The onboarding flow tested well: most people finished it in under two minutes, and nobody got stuck on the workspace step. The empty states got a lot of love.

Two things to follow up on. The invite screen still feels a little crowded on small phones, and a few people missed the “skip for now” link. I’ll pair with @Jordan on both tomorrow, then we can do one more pass before Friday.

Please add your feedback to the shared review notes so we can keep the decisions together. We’ll check the updated screens on both desktop and mobile, then confirm the final copy with the team before the launch.`;

function LongMessageDemo() {
  return (
    <ChatMessage
      side="incoming"
      author={CHAT_MEMBERS.alex.name}
      avatar={<ChatMemberAvatar member="alex" />}
    >
      <ChatCollapsibleMessage
        side="incoming"
        text={LONG_MESSAGE}
        renderText={(text) => (
          <ChatMessageText
            text={text}
            mentions={Object.values(CHAT_MEMBERS).map(
              (member) => member.handle,
            )}
          />
        )}
        showMoreLabel="Show more"
        showLessLabel="Show less"
      />
    </ChatMessage>
  );
}

const TIMELINE: {
  date: string;
  unread?: boolean;
  messages: { id: number; author: MemberId; text: string }[];
}[] = [
  {
    date: "Monday",
    messages: [
      { id: 1, author: "maya", text: "Kickoff notes are in the doc." },
      { id: 2, author: "you", text: "Thanks, reading now." },
      { id: 3, author: "jordan", text: "Added the open questions at the end." },
    ],
  },
  {
    date: "Yesterday",
    messages: [
      { id: 4, author: "alex", text: "Prototype link is ready." },
      { id: 5, author: "you", text: "Looks good on mobile too." },
    ],
  },
  {
    date: "Today",
    unread: true,
    messages: [
      { id: 6, author: "maya", text: "Can we review it at 3?" },
      { id: 7, author: "jordan", text: "Works for me." },
    ],
  },
];

function TimelineDemo() {
  const scroll = useChatScroll({ itemCount: 7 });
  return (
    <div className="-m-5 flex h-82 flex-col">
      <ChatConversation
        scroll={scroll}
        label="Timeline example"
        jumpLabel="Jump to latest"
      >
        {TIMELINE.map((group) => (
          <div
            key={group.date}
            className="not-first:mt-4 flex flex-col gap-4 first:pt-4"
          >
            <ChatDatePill>{group.date}</ChatDatePill>
            {group.unread && (
              <ChatUnreadDivider className="my-0">
                2 new messages
              </ChatUnreadDivider>
            )}
            <div className="flex flex-col gap-5">
              {group.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  side={message.author === "you" ? "outgoing" : "incoming"}
                  author={CHAT_MEMBERS[message.author].name}
                  avatar={<ChatMemberAvatar member={message.author} />}
                >
                  {message.text}
                </ChatMessage>
              ))}
            </div>
          </div>
        ))}
      </ChatConversation>
    </div>
  );
}

export function ChatFeatures() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <FeatureTile
        title="Replies"
        description="Quote a message and jump back to it in one click."
      >
        <RepliesDemo />
      </FeatureTile>
      <FeatureTile
        title="Reactions"
        description="Hover to react. Hover a chip to see who reacted."
      >
        <ReactionsDemo />
      </FeatureTile>
      <FeatureTile
        title="Mentions"
        description="Type @ for suggestions, with full keyboard support."
      >
        <MentionsDemo />
      </FeatureTile>
      <FeatureTile
        title="Delivery states"
        description="Sending, delivered, read, and a retry when it fails."
      >
        <DeliveryDemo />
      </FeatureTile>
      <FeatureTile
        title="Long messages"
        description="Long text collapses, keeping its paragraphs and mentions."
      >
        <LongMessageDemo />
      </FeatureTile>
      <FeatureTile
        title="Timeline"
        description="Sticky dates and an unread marker. Scroll up to jump back."
      >
        <TimelineDemo />
      </FeatureTile>
    </div>
  );
}
