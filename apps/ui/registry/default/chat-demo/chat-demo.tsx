"use client";

import {
  ArrowLeftIcon,
  BanIcon,
  ChevronRightIcon,
  EllipsisIcon,
  LockIcon,
  LogOutIcon,
  MicIcon,
  MicOffIcon,
  PinIcon,
  UserXIcon,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import type { ReactElement, ReactNode, RefObject } from "react";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { cn } from "@/registry/default/lib/utils";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/default/ui/alert-dialog";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/registry/default/ui/menu";
import { TooltipProvider } from "@/registry/default/ui/tooltip";
import { ChatConversation } from "../chat/chat-conversation";
import { ChatDatePill } from "../chat/chat-date-pill";
import { ChatMemberSection } from "../chat/chat-members";
import { ChatStatusBar } from "../chat/chat-states";
import { ChatTypingIndicator } from "../chat/chat-typing-indicator";
import { ChatUnreadDivider } from "../chat/chat-unread-divider";
import { useChatScroll } from "../chat/hooks/use-chat-scroll";
import { ChatDemoComposer } from "./chat-demo-composer";
import { ChatDemoMessage, ChatMemberAvatar } from "./chat-demo-message";
import { ChatMessageInfo } from "./chat-demo-message-info";
import { getMessageReceipts } from "./chat-demo-receipts";
import type { ChatReplyFocusTarget } from "./chat-demo-reply-focus";
import { ChatDemoReplyFocus } from "./chat-demo-reply-focus";
import { ChatTimelineState } from "./chat-demo-scenarios";
import type { ChatMessage, ChatScenario, MemberId } from "./chat-demo-state";
import {
  CHAT_MEMBERS,
  deleteChatMessage,
  getMessageDeletionReason,
  getMessagePreview,
  getScenarioMessages,
  getTypingLabel,
  INITIAL_CHAT_MESSAGES,
  OTHER_MEMBERS,
  toggleReaction,
} from "./chat-demo-state";

const DEMO_REPLIES = [
  "Thanks for sharing! I’ll take a look ✨",
  "Love that. Let’s pick it up in the walkthrough.",
  "Noted — I’ll bring this back to the group.",
];

// `focus()` on a contenteditable puts the caret at the start of an existing draft.
function focusAtEnd(input: HTMLElement | null): void {
  if (!input) return;
  input.focus({ preventScroll: true });
  const selection = window.getSelection();
  selection?.selectAllChildren(input);
  selection?.collapseToEnd();
}

function GroupDetails({
  open,
  onOpenChange,
  onClosed,
  position,
  activeMembers,
  mutedMembers,
  bannedMembers,
  onToggleMute,
  onRemove,
  onBan,
  onUnban,
  canLeave,
  onLeave,
  conversationFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClosed: () => void;
  position: "bottom" | "right";
  activeMembers: readonly MemberId[];
  mutedMembers: readonly MemberId[];
  bannedMembers: readonly MemberId[];
  onToggleMute: (member: MemberId) => void;
  onRemove: (member: MemberId) => void;
  onBan: (member: MemberId) => void;
  onUnban: (member: MemberId) => void;
  canLeave: boolean;
  onLeave: () => void;
  conversationFocusRef: RefObject<HTMLDivElement | null>;
}): ReactElement {
  const memberNames = activeMembers
    .map((member) => CHAT_MEMBERS[member].name)
    .join(", ");
  const previewNames = activeMembers
    .slice(0, 3)
    .map((member) => CHAT_MEMBERS[member].name)
    .join(", ");
  const [pendingRemoval, setPendingRemoval] = useState<MemberId | null>(null);
  const [moderationAction, setModerationAction] = useState<"remove" | "ban">(
    "remove",
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [restoredMember, setRestoredMember] = useState<MemberId | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const leaveTriggerRef = useRef<HTMLButtonElement>(null);
  const leaveRequestedRef = useRef(false);
  const editRefs = useRef<Partial<Record<MemberId, HTMLButtonElement>>>({});
  const unbanRefs = useRef<Partial<Record<MemberId, HTMLButtonElement>>>({});
  useEffect(() => {
    if (!restoredMember || !activeMembers.includes(restoredMember)) return;
    editRefs.current[restoredMember]?.focus();
    setRestoredMember(null);
  }, [activeMembers, restoredMember]);
  return (
    <Drawer
      position={position}
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) onClosed();
      }}
    >
      <DrawerTrigger
        ref={triggerRef}
        className="block max-w-full truncate text-start hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        aria-label={`View group members: ${memberNames}`}
      >
        {previewNames}
        {activeMembers.length > 3 ? " and others" : ""}
      </DrawerTrigger>
      <DrawerPopup
        variant="inset"
        initialFocus={backRef}
        finalFocus={triggerRef}
        className={
          position === "bottom" ? "[--drawer-height:92dvh]" : undefined
        }
      >
        <DrawerHeader>
          <div className="flex items-start gap-2">
            <DrawerClose
              render={
                <Button
                  ref={backRef}
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Back to conversation"
                />
              }
            >
              <ArrowLeftIcon />
            </DrawerClose>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <DrawerTitle>Group members</DrawerTitle>
              <DrawerDescription>
                The studio · {activeMembers.length} members
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <DrawerPanel>
          <div className="flex flex-col gap-7">
            <ChatMemberSection
              label="Current members"
              members={activeMembers.map((member) => ({
                id: member,
                name: CHAT_MEMBERS[member].name,
                avatar: <ChatMemberAvatar member={member} />,
                badges: (
                  <>
                    {member === "you" && <Badge variant="secondary">You</Badge>}
                    {CHAT_MEMBERS[member].role === "host" && (
                      <Badge variant="default">Host</Badge>
                    )}
                    {CHAT_MEMBERS[member].role === "co-host" && (
                      <Badge variant="default">Co-host</Badge>
                    )}
                    {mutedMembers.includes(member) && (
                      <Badge variant="error">
                        <MicOffIcon aria-hidden="true" /> Muted
                      </Badge>
                    )}
                  </>
                ),
                action:
                  CHAT_MEMBERS[member].role === "guest" ? (
                    <Menu>
                      <MenuTrigger
                        render={
                          <Button
                            ref={(node) => {
                              editRefs.current[member] = node ?? undefined;
                            }}
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`More actions for ${CHAT_MEMBERS[member].name}`}
                          />
                        }
                      >
                        <EllipsisIcon className="size-4" aria-hidden="true" />
                      </MenuTrigger>
                      <MenuPopup align="end">
                        <MenuItem onClick={() => onToggleMute(member)}>
                          {mutedMembers.includes(member) ? (
                            <>
                              <MicIcon aria-hidden="true" /> Unmute
                            </>
                          ) : (
                            <>
                              <MicOffIcon aria-hidden="true" /> Mute
                            </>
                          )}
                        </MenuItem>
                        <MenuItem
                          variant="destructive"
                          onClick={() => {
                            setPendingRemoval(member);
                            setModerationAction("remove");
                            setConfirmOpen(true);
                          }}
                        >
                          <UserXIcon aria-hidden="true" /> Remove from chat
                        </MenuItem>
                        <MenuItem
                          variant="destructive"
                          onClick={() => {
                            setPendingRemoval(member);
                            setModerationAction("ban");
                            setConfirmOpen(true);
                          }}
                        >
                          <BanIcon aria-hidden="true" /> Ban from chat
                        </MenuItem>
                      </MenuPopup>
                    </Menu>
                  ) : undefined,
              }))}
            />
            <ChatMemberSection
              label="Banned users"
              heading="Banned users"
              members={bannedMembers.map((member) => ({
                id: member,
                name: CHAT_MEMBERS[member].name,
                avatar: <ChatMemberAvatar member={member} />,
                dimmed: true,
                action: (
                  <Button
                    ref={(node) => {
                      unbanRefs.current[member] = node ?? undefined;
                    }}
                    variant="outline"
                    size="xs"
                    aria-label={`Unban ${CHAT_MEMBERS[member].name}`}
                    onClick={() => {
                      onUnban(member);
                      setRestoredMember(member);
                    }}
                  >
                    Unban
                  </Button>
                ),
              }))}
            />
          </div>
        </DrawerPanel>
        {canLeave && (
          <AlertDialog
            open={leaveConfirmOpen}
            onOpenChange={(nextOpen) => {
              if (nextOpen) leaveRequestedRef.current = false;
              setLeaveConfirmOpen(nextOpen);
            }}
            onOpenChangeComplete={(isOpen) => {
              if (!isOpen && leaveRequestedRef.current) onLeave();
            }}
          >
            <DrawerFooter>
              <AlertDialogTrigger
                render={
                  <Button
                    ref={leaveTriggerRef}
                    variant="destructive-outline"
                    size="sm"
                  />
                }
              >
                <LogOutIcon aria-hidden="true" />
                Leave chat
              </AlertDialogTrigger>
            </DrawerFooter>
            <AlertDialogPopup
              finalFocus={() =>
                leaveRequestedRef.current
                  ? conversationFocusRef.current
                  : leaveTriggerRef.current
              }
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Leave this chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  You’ll stop receiving messages from this group. Your ticket
                  for the event stays valid.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>
                  Cancel
                </AlertDialogClose>
                <AlertDialogClose
                  render={<Button variant="destructive" />}
                  onClick={() => {
                    leaveRequestedRef.current = true;
                  }}
                >
                  Leave chat
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        )}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogPopup
            finalFocus={() => {
              if (!pendingRemoval) return backRef.current;
              return (
                (bannedMembers.includes(pendingRemoval)
                  ? unbanRefs.current[pendingRemoval]
                  : editRefs.current[pendingRemoval]) ?? backRef.current
              );
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>
                {moderationAction === "ban" ? "Ban" : "Remove"}{" "}
                {pendingRemoval ? CHAT_MEMBERS[pendingRemoval].name : "member"}{" "}
                from the chat?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {moderationAction === "ban"
                  ? "They won’t be able to rejoin until you lift the ban. Their ticket stays valid."
                  : "They’ll leave the chat but can rejoin through their ticket invitation. Their ticket stays valid."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="ghost" />}>
                Cancel
              </AlertDialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  if (!pendingRemoval) return;
                  if (moderationAction === "ban") onBan(pendingRemoval);
                  else onRemove(pendingRemoval);
                  setConfirmOpen(false);
                }}
              >
                {moderationAction === "ban"
                  ? "Ban from chat"
                  : "Remove from chat"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>
      </DrawerPopup>
    </Drawer>
  );
}

export function ChatDemo({
  renderTriggers,
}: {
  renderTriggers: (select: (scenario: ChatScenario) => void) => ReactNode;
}): ReactElement {
  const id = useId();
  const position = useMediaQuery("md") ? "right" : "bottom";
  const [infoOpen, setInfoOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [infoMessageId, setInfoMessageId] = useState<number | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [scenario, setScenario] = useState<ChatScenario>("conversation");
  const [joinedChat, setJoinedChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadFrom, setUnreadFrom] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(
    INITIAL_CHAT_MESSAGES,
  );
  const [enteringMessageIds, setEnteringMessageIds] = useState<number[]>([]);
  const [draftValue, setDraftValue] = useState<ComposerValue>([]);
  const draft = getComposerText(draftValue);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyFocus, setReplyFocus] = useState<ChatReplyFocusTarget | null>(
    null,
  );
  const replyDismissalRef = useRef<"cancel" | "send">("cancel");
  const [pinnedId, setPinnedId] = useState<number | null>(null);
  const [typingMembers, setTypingMembers] = useState<MemberId[]>([]);
  const [mutedMembers, setMutedMembers] = useState<MemberId[]>([]);
  const [members, setMembers] = useState<MemberId[]>([...OTHER_MEMBERS, "you"]);
  const [bannedMembers, setBannedMembers] = useState<MemberId[]>([]);
  const [notice, setNotice] = useState("");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const infoReturnFocusRef = useRef<HTMLElement | null>(null);
  const deleteReturnFocusRef = useRef<HTMLElement | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const focusComposerAfterRestoreRef = useRef(false);
  const scroll = useChatScroll({
    active: open,
    paused: infoOpen || membersOpen || deleteOpen || replyFocus !== null,
    itemCount: messages.length,
    layoutKey: `${typingMembers.length}-${scenario}`,
    onReachEnd: () => setUnreadCount(0),
  });
  const { viewportRef: timelineRef, atBottomRef } = scroll;
  const nextIdRef = useRef(30);
  const replyIndexRef = useRef(0);
  const retryTimerRef = useRef<number | undefined>(undefined);
  const reconnectTimerRef = useRef<number | undefined>(undefined);
  const replyTimerRef = useRef<number | undefined>(undefined);
  const noticeTimerRef = useRef<number | undefined>(undefined);
  const highlightTimerRef = useRef<number | undefined>(undefined);
  const cancelJumpRef = useRef<(() => void) | undefined>(undefined);
  const messagesById = new Map(
    messages.map((message) => [message.id, message]),
  );
  const dateGroups = messages.reduce<
    Array<{
      dateLabel: string;
      entries: Array<{ message: ChatMessage; index: number }>;
    }>
  >((groups, message, index) => {
    const currentGroup = groups.at(-1);
    if (currentGroup?.dateLabel === message.dateLabel) {
      currentGroup.entries.push({ message, index });
    } else {
      groups.push({
        dateLabel: message.dateLabel,
        entries: [{ message, index }],
      });
    }
    return groups;
  }, []);
  const infoMessage =
    infoMessageId === null ? undefined : messagesById.get(infoMessageId);
  const replyMessage = replyTo === null ? undefined : messagesById.get(replyTo);
  const pinnedMessage =
    pinnedId === null ? undefined : messagesById.get(pinnedId);
  const activeOtherMembers = members.filter((member) => member !== "you");
  const composerDisabled = [
    "loading",
    "error",
    "offline",
    "reconnecting",
    "access-lost",
    "removed",
    "banned",
    "left",
  ].includes(scenario);

  useEffect(() => {
    if (open && scenario === "empty" && joinedChat)
      focusAtEnd(composerRef.current);
    if (
      open &&
      scenario === "conversation" &&
      focusComposerAfterRestoreRef.current
    ) {
      focusComposerAfterRestoreRef.current = false;
      focusAtEnd(composerRef.current);
    }
  }, [open, scenario, joinedChat]);

  const openMessageInfo = (
    messageId: number,
    trigger: HTMLElement | null,
  ): void => {
    infoReturnFocusRef.current = trigger;
    atBottomRef.current = false;
    setInfoMessageId(messageId);
    setInfoOpen(true);
  };

  const finishNestedDrawerClose = scroll.updatePosition;

  const changeScenario = (next: ChatScenario): void => {
    window.clearTimeout(replyTimerRef.current);
    window.clearTimeout(retryTimerRef.current);
    window.clearTimeout(reconnectTimerRef.current);
    window.clearTimeout(noticeTimerRef.current);
    window.clearTimeout(highlightTimerRef.current);
    cancelJumpRef.current?.();
    setInfoOpen(false);
    setMembersOpen(false);
    setInfoMessageId(null);
    setDeleteOpen(false);
    setDeleteMessageId(null);
    setScenario(next);
    setJoinedChat(false);
    setMessages(getScenarioMessages(next));
    setEnteringMessageIds([]);
    setTypingMembers(
      next === "typing"
        ? activeOtherMembers.filter((member) => member === "maya")
        : next === "typing-multiple"
          ? activeOtherMembers
          : [],
    );
    setReplyTo(null);
    setReplyFocus(null);
    setHighlightedId(null);
    setNotice("");
    setPinnedId(next === "pinned" ? 5 : null);
    nextIdRef.current = 30;
    setUnreadCount(next === "unread" ? 3 : 0);
    setUnreadFrom(next === "unread" ? 5 : null);
    scroll.resetScroll(next !== "unread");
  };

  const retryMessage = (messageId: number): void => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? { ...message, delivery: "sending" }
          : message,
      ),
    );
    window.clearTimeout(retryTimerRef.current);
    retryTimerRef.current = window.setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, delivery: "delivered", receipts: undefined }
            : message,
        ),
      );
      announce("Message delivered");
    }, 1200);
  };

  useEffect(
    () => () => {
      window.clearTimeout(replyTimerRef.current);
      window.clearTimeout(retryTimerRef.current);
      window.clearTimeout(reconnectTimerRef.current);
      window.clearTimeout(noticeTimerRef.current);
      window.clearTimeout(highlightTimerRef.current);
      cancelJumpRef.current?.();
    },
    [],
  );

  const announce = (text: string): void => {
    setNotice(text);
    window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 3000);
  };

  const sendMessage = (): void => {
    const text = draft.trim();
    if (!text || composerDisabled) return;
    if (
      scenario === "empty" ||
      scenario === "typing" ||
      scenario === "typing-multiple"
    )
      setScenario("conversation");
    const time = new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date());
    const message: ChatMessage = {
      id: nextIdRef.current++,
      author: "you",
      text,
      dateLabel: "Today",
      time,
      replyTo: replyTo ?? undefined,
      reactions: [],
    };
    atBottomRef.current = true;
    setEnteringMessageIds((current) => [...current, message.id]);
    setMessages((current) => [...current, message]);
    setDraftValue([]);
    replyDismissalRef.current = "send";
    setReplyTo(null);
    setTypingMembers(["maya"]);
    window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = window.setTimeout(() => {
      const response: ChatMessage = {
        id: nextIdRef.current++,
        author: "maya",
        text:
          DEMO_REPLIES[replyIndexRef.current++ % DEMO_REPLIES.length] ??
          "Thanks for sharing!",
        dateLabel: "Today",
        time,
        reactions: [],
      };
      if (!atBottomRef.current) {
        setUnreadCount((count) => count + 1);
        setUnreadFrom((first) => first ?? response.id);
      }
      if (timelineRef.current && atBottomRef.current) {
        setEnteringMessageIds((current) => [...current, response.id]);
      }
      setMessages((current) => [
        ...current.map((item) =>
          item.author === "you" &&
          item.delivery !== "failed" &&
          item.delivery !== "sending"
            ? { ...item, delivery: "read" as const, receipts: undefined }
            : item,
        ),
        response,
      ]);
      setTypingMembers([]);
    }, 1800);
  };

  const onReply = (
    messageId: number,
    source: HTMLDivElement,
    firstInGroup: boolean,
    expanded: boolean,
  ): void => {
    cancelJumpRef.current?.();
    setHighlightedId(null);
    atBottomRef.current = false;
    replyDismissalRef.current = "cancel";
    setReplyFocus({
      messageId,
      source,
      width: source.getBoundingClientRect().width,
      firstInGroup,
      expanded,
    });
    setReplyTo(messageId);
    focusAtEnd(composerRef.current);
  };

  const cancelReply = (): void => {
    replyDismissalRef.current = "cancel";
    setReplyTo(null);
  };

  const onReact = (messageId: number, emoji: string): void => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? { ...message, reactions: toggleReaction(message.reactions, emoji) }
          : message,
      ),
    );
  };

  const requestDelete = (
    messageId: number,
    trigger: HTMLElement | null,
  ): void => {
    const message = messagesById.get(messageId);
    if (!message || !getMessageDeletionReason(message)) return;
    deleteReturnFocusRef.current = trigger;
    setDeleteMessageId(messageId);
    setDeleteOpen(true);
  };

  const confirmDelete = (): void => {
    if (deleteMessageId === null) return;
    const message = messagesById.get(deleteMessageId);
    if (!message || !getMessageDeletionReason(message)) return;
    setMessages((current) =>
      current.map((message) =>
        message.id === deleteMessageId ? deleteChatMessage(message) : message,
      ),
    );
    if (pinnedId === deleteMessageId) setPinnedId(null);
    if (replyTo === deleteMessageId) setReplyTo(null);
    announce(getMessagePreview(deleteChatMessage(message)));
  };

  const onCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      announce("Message copied");
    } catch {
      announce("Couldn’t copy. Select the message text to copy it.");
    }
  };

  const removeMember = (member: MemberId): void => {
    setMembers((current) => current.filter((id) => id !== member));
    setTypingMembers((current) => current.filter((id) => id !== member));
    setMessages((current) =>
      current.map((message) => ({
        ...message,
        receipts: getMessageReceipts(message, activeOtherMembers).filter(
          (receipt) => receipt.member !== member,
        ),
      })),
    );
  };

  const onPin = (messageId: number): void => {
    setPinnedId((current) => (current === messageId ? null : messageId));
    announce(pinnedId === messageId ? "Message unpinned" : "Message pinned");
  };

  const onJump = (messageId: number): void => {
    const target = document.getElementById(`${id}-message-${messageId}`);
    if (!target) return;
    atBottomRef.current = false;
    cancelJumpRef.current?.();
    window.clearTimeout(highlightTimerRef.current);
    setHighlightedId(null);
    const timeline = timelineRef.current;
    const reveal = (): void => {
      cancelJumpRef.current?.();
      setHighlightedId(messageId);
      highlightTimerRef.current = window.setTimeout(
        () => setHighlightedId(null),
        420,
      );
    };
    const waitForScroll = (): void => {
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
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    target.focus({ preventScroll: true });
  };

  return (
    <TooltipProvider delay={300}>
      <Drawer
        position={position}
        open={open}
        onOpenChange={(nextOpen, details) => {
          if (
            !nextOpen &&
            details.reason === "escape-key" &&
            replyTo !== null
          ) {
            details.cancel();
            cancelReply();
            return;
          }
          setOpen(nextOpen);
          setEnteringMessageIds([]);
          if (!nextOpen) {
            cancelJumpRef.current?.();
            setHighlightedId(null);
            setInfoOpen(false);
            setMembersOpen(false);
          }
        }}
        onOpenChangeComplete={(isOpen) => {
          if (isOpen) return;
          setReplyTo(null);
          setReplyFocus(null);
        }}
      >
        {renderTriggers(changeScenario)}
        <DrawerPopup
          variant="inset"
          showCloseButton
          portalProps={{
            className: "max-md:[&_[data-slot=drawer-viewport]]:pt-2",
          }}
          className={
            position === "bottom"
              ? "pb-[max(var(--drawer-keyboard-inset,0px),env(safe-area-inset-bottom,0px))] [--drawer-height:100dvh]"
              : undefined
          }
        >
          <DrawerHeader>
            <DrawerTitle>The studio</DrawerTitle>
            <DrawerDescription>
              {scenario === "removed" ? (
                "You were removed from this chat"
              ) : scenario === "banned" ? (
                "You were banned from this chat"
              ) : scenario === "left" ? (
                "You left this chat"
              ) : (
                <GroupDetails
                  open={membersOpen}
                  onOpenChange={(nextOpen) => {
                    if (nextOpen) atBottomRef.current = false;
                    setMembersOpen(nextOpen);
                  }}
                  onClosed={finishNestedDrawerClose}
                  position={position}
                  activeMembers={members}
                  mutedMembers={mutedMembers}
                  bannedMembers={bannedMembers}
                  onToggleMute={(member) =>
                    setMutedMembers((current) =>
                      current.includes(member)
                        ? current.filter((id) => id !== member)
                        : [...current, member],
                    )
                  }
                  onRemove={removeMember}
                  onBan={(member) => {
                    setBannedMembers((current) => [...current, member]);
                    removeMember(member);
                  }}
                  onUnban={(member) => {
                    setBannedMembers((current) =>
                      current.filter((id) => id !== member),
                    );
                    setMembers((current) =>
                      current.includes(member) ? current : [...current, member],
                    );
                  }}
                  canLeave={scenario !== "access-lost"}
                  onLeave={() => {
                    changeScenario("left");
                    setDraftValue([]);
                  }}
                  conversationFocusRef={timelineRef}
                />
              )}
            </DrawerDescription>
          </DrawerHeader>
          {pinnedMessage && !pinnedMessage.deletedReason && (
            <Button
              variant="ghost"
              className="h-auto shrink-0 justify-start gap-3 rounded-none border-border/60 border-x-0 border-y bg-muted/72 px-5 py-2.5 text-start sm:h-auto"
              onClick={() => onJump(pinnedMessage.id)}
              aria-label="Jump to pinned message"
            >
              <PinIcon
                aria-hidden="true"
                className="size-3.5 text-muted-foreground"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-[.625rem] text-muted-foreground">
                  Pinned message
                </span>
                <span className="truncate font-normal text-xs">
                  {pinnedMessage.text}
                </span>
              </span>
              <ChevronRightIcon
                aria-hidden="true"
                className="size-3 text-muted-foreground"
              />
            </Button>
          )}
          {(scenario === "offline" || scenario === "reconnecting") && (
            <ChatStatusBar
              title={
                scenario === "offline" ? "You’re offline" : "Reconnecting…"
              }
              description="Your draft is saved here. Sending will resume when connected."
              action={
                <Button
                  variant="outline"
                  size="xs"
                  loading={scenario === "reconnecting"}
                  onClick={() => {
                    setScenario("reconnecting");
                    window.clearTimeout(reconnectTimerRef.current);
                    reconnectTimerRef.current = window.setTimeout(() => {
                      focusComposerAfterRestoreRef.current = true;
                      setScenario("conversation");
                      announce("Connected");
                    }, 1200);
                  }}
                >
                  Reconnect
                </Button>
              }
            />
          )}
          <DrawerPanel
            scrollable={false}
            className="relative flex min-h-0 flex-1 flex-col overflow-clip p-0 pt-0!"
          >
            <ChatConversation
              scroll={scroll}
              label="Conversation messages"
              inactive={replyFocus !== null}
              jumpLabel={
                unreadCount
                  ? `${unreadCount} new ${unreadCount === 1 ? "message" : "messages"}`
                  : "Jump to latest"
              }
              contentClassName={cn(
                [
                  "empty",
                  "error",
                  "access-lost",
                  "removed",
                  "banned",
                  "left",
                ].includes(scenario) && "flex min-h-full flex-col",
                (scenario === "removed" ||
                  scenario === "banned" ||
                  scenario === "left") &&
                  "justify-center",
              )}
              overlay={
                <AnimatePresence
                  initial={false}
                  onExitComplete={() => {
                    setReplyFocus(null);
                    finishNestedDrawerClose();
                  }}
                >
                  {replyMessage && replyFocus && (
                    <ChatDemoReplyFocus
                      key={replyMessage.id}
                      target={replyFocus}
                      message={replyMessage}
                      replyMessage={messagesById.get(
                        replyMessage.replyTo ?? -1,
                      )}
                      dismissalRef={replyDismissalRef}
                      onCancel={cancelReply}
                    />
                  )}
                </AnimatePresence>
              }
            >
              <ChatTimelineState
                scenario={scenario}
                onRecover={() => {
                  if (scenario === "left" || scenario === "removed")
                    focusComposerAfterRestoreRef.current = true;
                  changeScenario("conversation");
                }}
                memberCount={activeOtherMembers.length}
                joined={joinedChat}
                onJoin={() => setJoinedChat(true)}
              />
              <div>
                {dateGroups.map((group) => (
                  <div
                    key={group.entries[0]?.message.id}
                    className="not-first:mt-4 flex flex-col gap-4 first:pt-4"
                  >
                    {group.dateLabel && (
                      <ChatDatePill>{group.dateLabel}</ChatDatePill>
                    )}
                    <div className="flex flex-col">
                      {group.entries.map(({ message, index }, entryIndex) => {
                        const previousMessage = messages[index - 1];
                        const grouped =
                          previousMessage?.author === message.author &&
                          previousMessage.dateLabel === message.dateLabel &&
                          !message.deletedReason &&
                          !previousMessage.deletedReason;
                        const followsSeparator =
                          entryIndex === 0 || message.id === unreadFrom;
                        return (
                          <Fragment key={message.id}>
                            {message.id === unreadFrom && (
                              <ChatUnreadDivider className="first:mt-0">
                                New messages
                              </ChatUnreadDivider>
                            )}
                            <div
                              className={cn(
                                !followsSeparator &&
                                  (grouped
                                    ? previousMessage.delivery
                                      ? "pt-3"
                                      : "pt-1"
                                    : "pt-5"),
                              )}
                            >
                              <ChatDemoMessage
                                message={message}
                                recipients={activeOtherMembers}
                                entering={enteringMessageIds.includes(
                                  message.id,
                                )}
                                onEntranceEnd={() =>
                                  setEnteringMessageIds((current) =>
                                    current.filter((id) => id !== message.id),
                                  )
                                }
                                replyMessage={messagesById.get(
                                  message.replyTo ?? -1,
                                )}
                                grouped={grouped}
                                groupEnd={
                                  messages[index + 1]?.author !==
                                    message.author ||
                                  messages[index + 1]?.dateLabel !==
                                    message.dateLabel ||
                                  Boolean(
                                    message.deletedReason ||
                                      messages[index + 1]?.deletedReason,
                                  )
                                }
                                pinned={pinnedId === message.id}
                                highlighted={highlightedId === message.id}
                                replyLifted={
                                  replyFocus?.messageId === message.id
                                }
                                domId={`${id}-message-${message.id}`}
                                onReply={onReply}
                                onReact={onReact}
                                onPin={onPin}
                                onDelete={requestDelete}
                                onCopy={onCopy}
                                onJump={onJump}
                                onRetry={retryMessage}
                                onInfo={openMessageInfo}
                              />
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <ChatTypingIndicator
                visible={typingMembers.length > 0}
                label={getTypingLabel(typingMembers)}
                className="ps-9 pt-5"
              />
            </ChatConversation>
          </DrawerPanel>
          {scenario === "empty" && !joinedChat && (
            <DrawerFooter
              variant="bare"
              className="items-center text-muted-foreground text-xs sm:justify-center"
            >
              <div className="flex flex-col gap-1.5">
                <span className="flex items-start gap-2">
                  <LockIcon
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0"
                  />
                  Only members can see this chat and who’s in it.
                </span>
                <span className="flex items-start gap-2">
                  <LogOutIcon
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0"
                  />
                  Leave any time — your ticket stays valid.
                </span>
              </div>
            </DrawerFooter>
          )}
          {scenario !== "removed" &&
            scenario !== "banned" &&
            scenario !== "left" &&
            scenario !== "error" &&
            scenario !== "access-lost" &&
            (scenario !== "empty" || joinedChat) && (
              <ChatDemoComposer
                value={draftValue}
                onValueChange={setDraftValue}
                replyAuthor={
                  replyMessage
                    ? CHAT_MEMBERS[replyMessage.author].name
                    : undefined
                }
                mentionMembers={activeOtherMembers}
                onSend={sendMessage}
                inputRef={composerRef}
                notice={notice}
                disabled={composerDisabled}
              />
            )}
          <ChatMessageInfo
            message={infoMessage}
            recipients={activeOtherMembers}
            replyMessage={messagesById.get(infoMessage?.replyTo ?? -1)}
            position={position}
            open={infoOpen}
            onOpenChange={setInfoOpen}
            onClosed={finishNestedDrawerClose}
            returnFocusRef={infoReturnFocusRef}
          />
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogPopup
              finalFocus={() => {
                if (deleteReturnFocusRef.current?.isConnected)
                  return deleteReturnFocusRef.current;
                return (
                  document.getElementById(`${id}-message-${deleteMessageId}`) ??
                  timelineRef.current
                );
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This message will be deleted for everyone. This can’t be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>
                  Cancel
                </AlertDialogClose>
                <AlertDialogClose
                  render={<Button variant="destructive" />}
                  onClick={confirmDelete}
                >
                  Delete message
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </DrawerPopup>
      </Drawer>
    </TooltipProvider>
  );
}
