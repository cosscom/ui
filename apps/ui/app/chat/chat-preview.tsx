"use client";

import { PhoneIcon, PlusIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { ChatCollapsibleMessage } from "@/registry/default/chat/chat-collapsible-message";
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
import { cn } from "@/registry/default/lib/utils";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";
import { toastManager } from "@/registry/default/ui/toast";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { useChatPreviewPlayback } from "./use-chat-preview-playback";

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

const GROUP_MESSAGES: PreviewMessage[] = [
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
    text: "Same here. Let’s ship it 🚀",
    status: "read",
    reactions: [],
  },
];

function getPreview(message: PreviewMessage | undefined) {
  return message?.text ?? "Message unavailable";
}

const DIRECT_MESSAGES: PreviewMessage[] = [
  {
    id: 1,
    author: "maya",
    text: "Hey Sam, can you review the onboarding flow?",
    reactions: [],
  },
  {
    id: 2,
    author: "you",
    text: "Just tried it. The empty state looks great!",
    status: "read",
    reactions: [{ emoji: "❤️", members: ["maya"] }],
  },
  {
    id: 3,
    author: "maya",
    text: "Thanks! Shall we walk through the last details together?",
    reactions: [],
  },
];

const DIRECT_REPLIES = [
  "Sounds good. I’ll send you the latest version.",
  "Thanks for taking a look. Your feedback helps!",
  "Perfect. Let’s catch up this afternoon.",
];

export function ChatPreview({ direct = false }: { direct?: boolean }) {
  const previewId = useId();
  const initialMessages = direct ? DIRECT_MESSAGES : GROUP_MESSAGES;
  const members: MemberId[] = direct ? ["maya"] : ["maya", "jordan", "alex"];
  const [draft, setDraft] = useState<ComposerValue>([]);
  const [messages, setMessages] = useState(initialMessages);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyFocus, setReplyFocus] = useState<
    (ChatReplyTarget & { messageId: number; expanded: boolean }) | null
  >(null);
  const [expandedMessages, setExpandedMessages] = useState<
    Record<number, boolean>
  >({});
  const highlightTimerRef = useRef<number | undefined>(undefined);
  const cancelJumpRef = useRef<(() => void) | undefined>(undefined);
  const dismissalRef = useRef<"cancel" | "send">("cancel");
  const bubbles = useRef(new Map<number, HTMLDivElement>());
  const [typing, setTyping] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(initialMessages.length + 1);
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
      cancelJumpRef.current?.();
      window.clearTimeout(highlightTimerRef.current);
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

  const playbackMessageId = useRef<number | null>(null);
  const playback = useChatPreviewPlayback((step) => {
    if (step.type === "draft") {
      setDraft([{ type: "text", text: step.text }]);
    } else if (step.type === "send") {
      const id = nextId.current++;
      playbackMessageId.current = id;
      scroll.atBottomRef.current = true;
      setMessages((current) => [
        ...current,
        {
          id,
          author: "you",
          text: step.text,
          status: "sending",
          reactions: [],
        },
      ]);
      setDraft([]);
    } else if (step.type === "reply") {
      const id = nextId.current++;
      setTyping(false);
      setMessages((current) => [
        ...current,
        { id, author: "maya", text: step.text, reactions: [] },
      ]);
    } else if (playbackMessageId.current !== null) {
      setStatus(
        playbackMessageId.current,
        step.type === "delivered" ? "delivered" : "read",
      );
      if (step.type === "typing") setTyping(true);
    }
  });
  const stopPlayback = () => {
    if (!playback.stop()) return;
    setDraft([]);
    setTyping(false);
    if (playbackMessageId.current !== null)
      setStatus(playbackMessageId.current, "read");
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
    const target = document.getElementById(`${previewId}-message-${id}`);
    if (!target) return;
    scroll.atBottomRef.current = false;
    cancelJumpRef.current?.();
    window.clearTimeout(highlightTimerRef.current);
    setHighlighted(null);
    const timeline = scroll.viewportRef.current;
    const reveal = () => {
      cancelJumpRef.current?.();
      setHighlighted(id);
      highlightTimerRef.current = window.setTimeout(
        () => setHighlighted(null),
        420,
      );
    };
    const waitForScroll = () => {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = window.setTimeout(reveal, 100);
    };
    timeline?.addEventListener("scroll", waitForScroll, { passive: true });
    cancelJumpRef.current = () => {
      timeline?.removeEventListener("scroll", waitForScroll);
      window.clearTimeout(highlightTimerRef.current);
    };
    waitForScroll();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
    target.focus({ preventScroll: true });
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
      const replies = direct ? DIRECT_REPLIES : REPLIES;
      const reply = replies[replyIndex.current++ % replies.length] ?? "";
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
        <ChatCollapsibleMessage
          text={message.text}
          side={message.author === "you" ? "outgoing" : "incoming"}
          showMoreLabel="Show more"
          showLessLabel="Show less"
          defaultOpen={focused ? replyFocus?.expanded : undefined}
          open={focused ? undefined : (expandedMessages[message.id] ?? false)}
          onOpenChange={
            focused
              ? undefined
              : (expanded) => {
                  setExpandedMessages((current) => ({
                    ...current,
                    [message.id]: expanded,
                  }));
                }
          }
          renderText={(text) => (
            <ChatMessageText text={text} mentions={MENTION_HANDLES} />
          )}
        />
      </>
    );
  };

  return (
    <section
      ref={playback.ref}
      onFocusCapture={(event) => {
        if (event.target === inputRef.current) stopPlayback();
      }}
      aria-label={direct ? "Direct message preview" : "Live chat preview"}
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
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3.5">
        <div className="flex items-center gap-3">
          {direct && (
            <div className="relative flex shrink-0">
              <ChatMemberAvatar member="maya" className="size-9" />
              <span
                aria-hidden="true"
                className="absolute end-0.5 bottom-0.5 size-2 rounded-full bg-success outline-2 outline-popover"
              />
            </div>
          )}
          <div>
            <h2 className="font-medium text-sm">
              {direct ? "Maya Chen" : "Launch week"}
            </h2>
            <p className="mt-0.5 text-muted-foreground text-xs">
              {direct ? "Online" : "Maya, Jordan, Alex, and you"}
            </p>
          </div>
        </div>
        {direct ? (
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-lg" />}
              aria-label="Call Maya"
              onClick={() => {
                toastManager.add({
                  title: "Voice call preview",
                  description: "Calls aren’t connected in this demo.",
                });
              }}
            >
              <PhoneIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipPopup>Call Maya</TooltipPopup>
          </Tooltip>
        ) : (
          <div className="flex -space-x-1.5">
            {members.map((member) => (
              <ChatMemberAvatar
                key={member}
                member={member}
                className="size-6 ring-2 ring-popover"
              />
            ))}
          </div>
        )}
      </div>
      <ChatConversation
        className="overflow-clip"
        scroll={scroll}
        label="Preview messages"
        live={playback.active ? "off" : undefined}
        jumpLabel="Jump to latest"
        inactive={replyFocus !== null}
        overlay={
          <AnimatePresence
            initial={false}
            onExitComplete={() => {
              setReplyFocus(null);
              scroll.updatePosition();
            }}
          >
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
        <div className="flex flex-col pt-4">
          {messages.map((message, index) => {
            const own = message.author === "you";
            const previous = messages[index - 1];
            const grouped = previous?.author === message.author;
            const groupEnd = messages[index + 1]?.author !== message.author;
            return (
              <div
                key={message.id}
                className={cn(
                  index > 0 &&
                    (grouped ? (previous.status ? "pt-3" : "pt-1") : "pt-5"),
                )}
              >
                <ChatMessage
                  id={`${previewId}-message-${message.id}`}
                  tabIndex={-1}
                  aria-label={`${CHAT_MEMBERS[message.author].name}, at 10:42`}
                  grouped={grouped}
                  side={own ? "outgoing" : "incoming"}
                  author={CHAT_MEMBERS[message.author].name}
                  avatar={<ChatMemberAvatar member={message.author} />}
                  animateEntrance={message.id > initialMessages.length}
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
                          triggerLabel="React to message"
                          triggerTooltip="React"
                          popupLabel="Choose a reaction"
                          popupAlign={own ? "start" : "end"}
                          popupAnchor={toolbarRef}
                          onSelect={(emoji) =>
                            toggleReaction(message.id, emoji)
                          }
                        />
                      )}
                      onReply={() => {
                        const source = bubbles.current.get(message.id);
                        if (!source) return;
                        cancelJumpRef.current?.();
                        setHighlighted(null);
                        scroll.atBottomRef.current = false;
                        dismissalRef.current = "cancel";
                        setReplyFocus({
                          messageId: message.id,
                          source,
                          width: source.getBoundingClientRect().width,
                          firstInGroup: !grouped,
                          expanded: expandedMessages[message.id] ?? false,
                        });
                        setReplyTo(message.id);
                        inputRef.current?.focus({ preventScroll: true });
                        const selection = window.getSelection();
                        if (inputRef.current) {
                          selection?.selectAllChildren(inputRef.current);
                          selection?.collapseToEnd();
                        }
                      }}
                      replyLabel={`Reply to ${CHAT_MEMBERS[message.author].name}`}
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
                              animateEntrance={
                                !initialMessages
                                  .find((item) => item.id === message.id)
                                  ?.reactions.some(
                                    (item) => item.emoji === reaction.emoji,
                                  )
                              }
                              emoji={reaction.emoji}
                              count={reaction.members.length}
                              selected={selected}
                              label={`${selected ? "Remove" : "Add"} ${reaction.emoji} reaction, ${reaction.members.length} ${reaction.members.length === 1 ? "person" : "people"}`}
                              reactorLabel={`${reaction.members.length} ${reaction.members.length === 1 ? "reaction" : "reactions"}`}
                              popupAlign={own ? "end" : "start"}
                              onClick={() =>
                                toggleReaction(message.id, reaction.emoji)
                              }
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
                        })
                      : undefined
                  }
                  footer={
                    groupEnd || message.status ? (
                      <>
                        <time>10:42</time>
                        {message.status && (
                          <ChatDeliveryIndicator
                            status={message.status}
                            label={STATUS_LABELS[message.status]}
                          />
                        )}
                      </>
                    ) : undefined
                  }
                >
                  {renderBody(message)}
                </ChatMessage>
              </div>
            );
          })}
          <ChatTypingIndicator
            visible={typing}
            label="Maya is typing"
            className="pt-4"
          />
        </div>
      </ChatConversation>
      <ChatDemoComposer
        className="[&_[data-slot=composer]]:[--composer-min-rows:1] md:[&_[data-slot=composer]]:[--composer-radius:--spacing(6)]"
        showKeyboardHint={false}
        startAction={
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full before:rounded-full"
                />
              }
              aria-label="Add attachment"
              onClick={() => {
                toastManager.add({
                  title: "Attachment preview",
                  description: "Attachments aren’t connected in this demo.",
                });
              }}
            >
              <PlusIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipPopup>Add attachment</TooltipPopup>
          </Tooltip>
        }
        value={draft}
        onValueChange={setDraft}
        inputRef={inputRef}
        mentionMembers={members}
        placeholder={direct ? "Message Maya…" : "Message the group…"}
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
    </section>
  );
}
