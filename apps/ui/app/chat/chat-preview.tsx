"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChatConversation } from "@/registry/default/chat/chat-conversation";
import { ChatDeliveryIndicator } from "@/registry/default/chat/chat-delivery-indicator";
import { ChatMessage } from "@/registry/default/chat/chat-message";
import { ChatMessageActionToolbar } from "@/registry/default/chat/chat-message-actions";
import { ChatMessageText } from "@/registry/default/chat/chat-message-text";
import { ChatReactionChip } from "@/registry/default/chat/chat-reaction-chip";
import { ChatReactionPicker } from "@/registry/default/chat/chat-reaction-picker";
import {
  ChatReplyPreview,
  type ChatReplyTarget,
} from "@/registry/default/chat/chat-reply-preview";
import { ChatReplyReference } from "@/registry/default/chat/chat-reply-reference";
import { ChatTypingIndicator } from "@/registry/default/chat/chat-typing-indicator";
import { useChatScroll } from "@/registry/default/chat/hooks/use-chat-scroll";
import { ChatDemoComposer } from "@/registry/default/chat-demo/chat-demo-composer";
import { ChatMemberAvatar } from "@/registry/default/chat-demo/chat-demo-message";
import {
  CHAT_EMOJI,
  CHAT_MEMBERS,
  type MemberId,
} from "@/registry/default/chat-demo/chat-demo-state";
import {
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";

type Status = "sending" | "delivered" | "read";

type PreviewMessage = {
  id: number;
  author: MemberId;
  text: string;
  replyTo?: number;
  status?: Status;
  reactions: { emoji: string; members: MemberId[] }[];
};

const STATUS_LABELS: Record<Status, string> = {
  sending: "Sending",
  delivered: "Delivered",
  read: "Read",
};

const MENTION_HANDLES = Object.values(CHAT_MEMBERS).map(
  (member) => member.handle,
);

const REPLIES = [
  "Love that. Adding it to the release notes.",
  "Good call, @Jordan will want to see this too.",
  "Perfect. Let’s keep the momentum going.",
];

const INITIAL_MESSAGES: PreviewMessage[] = [
  {
    id: 1,
    author: "maya",
    text: "Pushed the new onboarding flow. Would love eyes on it before Friday.",
    reactions: [{ emoji: "🙏", members: ["jordan"] }],
  },
  {
    id: 2,
    author: "jordan",
    replyTo: 1,
    text: "Looks great, @Maya. The empty state is my favorite part.",
    reactions: [{ emoji: "❤️", members: ["maya", "alex"] }],
  },
  {
    id: 3,
    author: "you",
    text: "Same here. Let’s ship it ✨",
    status: "read",
    reactions: [],
  },
];

function getPreview(message: PreviewMessage | undefined) {
  return message?.text ?? "Message unavailable";
}

function getReactorNames(members: readonly MemberId[]) {
  return members.map((member) => CHAT_MEMBERS[member].name);
}

export function ChatPreview() {
  const [draft, setDraft] = useState<ComposerValue>([]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyFocus, setReplyFocus] = useState<
    (ChatReplyTarget & { messageId: number }) | null
  >(null);
  const dismissalRef = useRef<"cancel" | "send">("cancel");
  const bubbles = useRef(new Map<number, HTMLDivElement>());
  const [typing, setTyping] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(INITIAL_MESSAGES.length + 1);
  const replyIndex = useRef(0);
  const timers = useRef<number[]>([]);
  const scroll = useChatScroll({
    paused: replyFocus !== null,
    itemCount: messages.length,
    layoutKey: typing ? "typing" : "idle",
  });

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) window.clearTimeout(timer);
    };
  }, []);

  const later = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  const setStatus = (id: number, status: Status) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, status } : message,
      ),
    );
  };

  const toggleReaction = (id: number, emoji: string) => {
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== id) return message;
        const existing = message.reactions.find(
          (reaction) => reaction.emoji === emoji,
        );
        if (!existing) {
          return {
            ...message,
            reactions: [...message.reactions, { emoji, members: ["you"] }],
          };
        }
        const members = existing.members.includes("you")
          ? existing.members.filter((member) => member !== "you")
          : [...existing.members, "you" as const];
        return {
          ...message,
          reactions: message.reactions
            .map((reaction) =>
              reaction.emoji === emoji ? { ...reaction, members } : reaction,
            )
            .filter((reaction) => reaction.members.length > 0),
        };
      }),
    );
  };

  const jumpTo = (id: number) => {
    setHighlighted(id);
    document.getElementById(`chat-preview-${id}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
    });
    later(() => setHighlighted(null), 600);
  };

  const send = (text: string) => {
    const id = nextId.current++;
    scroll.atBottomRef.current = true;
    setMessages((current) => [
      ...current,
      {
        id,
        author: "you",
        text,
        replyTo: replyTo ?? undefined,
        status: "sending",
        reactions: [],
      },
    ]);
    setDraft([]);
    dismissalRef.current = "send";
    setReplyTo(null);
    later(() => setStatus(id, "delivered"), 700);
    later(() => {
      setStatus(id, "read");
      setTyping(true);
    }, 1400);
    later(() => {
      const reply = REPLIES[replyIndex.current++ % REPLIES.length] ?? "";
      setTyping(false);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          author: "maya",
          text: reply,
          replyTo: id,
          reactions: [],
        },
      ]);
    }, 3200);
  };

  const replyMessage = messages.find(
    (message) => message.id === replyFocus?.messageId,
  );
  const cancelReply = () => {
    dismissalRef.current = "cancel";
    setReplyTo(null);
  };
  const renderBody = (message: PreviewMessage, focused = false) => {
    const quoted = messages.find((item) => item.id === message.replyTo);
    return (
      <>
        {message.replyTo && (
          <ChatReplyReference
            author={
              quoted ? CHAT_MEMBERS[quoted.author].name : "Original message"
            }
            preview={getPreview(quoted)}
            disabled={!quoted || focused}
            onClick={() => message.replyTo && jumpTo(message.replyTo)}
          />
        )}
        <ChatMessageText text={message.text} mentions={MENTION_HANDLES} />
      </>
    );
  };

  return (
    <section
      aria-label="Live chat preview"
      onKeyDown={(event) => {
        if (
          event.key === "Escape" &&
          !event.defaultPrevented &&
          replyTo !== null
        ) {
          event.preventDefault();
          cancelReply();
        }
      }}
      className="flex h-144 min-w-0 flex-col overflow-hidden rounded-2xl border bg-popover shadow-lg/5"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b px-5 py-3.5">
        <div>
          <h2 className="font-medium text-sm">Launch week</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">
            Maya, Jordan, Alex, and you
          </p>
        </div>
        <div className="flex -space-x-1.5">
          {(["maya", "jordan", "alex"] as const).map((member) => (
            <ChatMemberAvatar
              key={member}
              member={member}
              className="size-6 ring-2 ring-popover"
            />
          ))}
        </div>
      </div>
      <ChatConversation
        scroll={scroll}
        label="Preview messages"
        jumpLabel="Jump to latest"
        inactive={replyFocus !== null}
        overlay={
          <AnimatePresence onExitComplete={() => setReplyFocus(null)}>
            {replyTo !== null && replyFocus && replyMessage && (
              <ChatReplyPreview
                key={replyMessage.id}
                target={replyFocus}
                side={replyMessage.author === "you" ? "outgoing" : "incoming"}
                avatar={<ChatMemberAvatar member={replyMessage.author} />}
                author={CHAT_MEMBERS[replyMessage.author].name}
                replyLabel={
                  replyMessage.author === "you"
                    ? "Reply to your message"
                    : `Reply to ${CHAT_MEMBERS[replyMessage.author].name}`
                }
                cancelLabel="Cancel reply"
                dismissalRef={dismissalRef}
                onCancel={cancelReply}
              >
                {renderBody(replyMessage, true)}
              </ChatReplyPreview>
            )}
          </AnimatePresence>
        }
      >
        <div className="flex flex-col gap-4 pt-4">
          {messages.map((message) => {
            const own = message.author === "you";
            return (
              <ChatMessage
                key={message.id}
                id={`chat-preview-${message.id}`}
                side={own ? "outgoing" : "incoming"}
                author={CHAT_MEMBERS[message.author].name}
                avatar={<ChatMemberAvatar member={message.author} />}
                animateEntrance={message.id > INITIAL_MESSAGES.length}
                highlighted={highlighted === message.id}
                lifted={replyFocus?.messageId === message.id}
                bubbleProps={{
                  ref: (element) => {
                    if (element) bubbles.current.set(message.id, element);
                    else bubbles.current.delete(message.id);
                  },
                }}
                actions={
                  <ChatMessageActionToolbar
                    side={own ? "outgoing" : "incoming"}
                    toolbarLabel="Message actions"
                    reactionPicker={(toolbarRef) => (
                      <ChatReactionPicker
                        inToolbar
                        options={CHAT_EMOJI}
                        selectedEmojis={message.reactions
                          .filter((reaction) =>
                            reaction.members.includes("you"),
                          )
                          .map((reaction) => reaction.emoji)}
                        triggerLabel="Add reaction"
                        triggerTooltip="React"
                        popupLabel="Reactions"
                        popupAnchor={toolbarRef}
                        onSelect={(emoji) => toggleReaction(message.id, emoji)}
                      />
                    )}
                    onReply={() => {
                      const source = bubbles.current.get(message.id);
                      if (!source) return;
                      dismissalRef.current = "cancel";
                      setReplyFocus({
                        messageId: message.id,
                        source,
                        width: source.getBoundingClientRect().width,
                        firstInGroup: true,
                      });
                      setReplyTo(message.id);
                      inputRef.current?.focus({ preventScroll: true });
                      const selection = window.getSelection();
                      if (inputRef.current) {
                        selection?.selectAllChildren(inputRef.current);
                        selection?.collapseToEnd();
                      }
                    }}
                    replyLabel="Reply"
                    replyTooltip="Reply"
                  />
                }
                reactions={
                  message.reactions.length > 0
                    ? message.reactions.map((reaction) => {
                        const selected = reaction.members.includes("you");
                        return (
                          <ChatReactionChip
                            key={reaction.emoji}
                            animateEntrance
                            emoji={reaction.emoji}
                            count={reaction.members.length}
                            selected={selected}
                            label={`${selected ? "Remove" : "Add"} ${reaction.emoji} reaction`}
                            reactorLabel={`People who reacted with ${reaction.emoji}`}
                            onClick={() =>
                              toggleReaction(message.id, reaction.emoji)
                            }
                            reactorContent={
                              <ul className="space-y-1 p-1 text-xs">
                                {getReactorNames(reaction.members).map(
                                  (name) => (
                                    <li key={name}>{name}</li>
                                  ),
                                )}
                              </ul>
                            }
                          />
                        );
                      })
                    : undefined
                }
                footer={
                  <span className="inline-flex items-center gap-1">
                    10:42
                    {message.status && (
                      <ChatDeliveryIndicator
                        status={message.status}
                        label={STATUS_LABELS[message.status]}
                      />
                    )}
                  </span>
                }
              >
                {renderBody(message)}
              </ChatMessage>
            );
          })}
          <ChatTypingIndicator visible={typing} label="Maya is typing" />
        </div>
      </ChatConversation>
      <div className="relative z-20 shrink-0 px-4 pb-4">
        <ChatDemoComposer
          className="px-0 pb-0"
          value={draft}
          onValueChange={setDraft}
          inputRef={inputRef}
          mentionMembers={["maya", "jordan", "alex"]}
          replyAuthor={
            replyTo !== null && replyMessage
              ? CHAT_MEMBERS[replyMessage.author].name
              : undefined
          }
          notice=""
          onSend={() => {
            const text = getComposerText(draft).trim();
            if (text) send(text);
          }}
        />
      </div>
    </section>
  );
}
