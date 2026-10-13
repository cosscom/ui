"use client";

import {
  BanIcon,
  CircleAlertIcon,
  LockIcon,
  LogOutIcon,
  MessageCircleIcon,
  UserXIcon,
} from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "@/registry/default/ui/button";
import { ChatEmptyState, ChatLoadingState } from "../chat/chat-states";
import type { ChatScenario } from "./chat-demo-state";

export function ChatTimelineState({
  scenario,
  onRecover,
  memberCount,
  joined,
  onJoin,
}: {
  scenario: ChatScenario;
  onRecover: () => void;
  memberCount: number;
  joined: boolean;
  onJoin: () => void;
}): ReactElement | null {
  if (scenario === "loading")
    return (
      <ChatLoadingState label="Loading conversation">
        <Button variant="outline" size="sm" onClick={onRecover}>
          Finish loading preview
        </Button>
      </ChatLoadingState>
    );
  const content = {
    empty: {
      title: joined ? "A little hello goes a long way" : "Join the event chat",
      description: joined
        ? "Start the conversation. Everyone in the group can join in."
        : "Talk with the host and other guests who are going. Only people who join can read or send messages.",
      Icon: MessageCircleIcon,
    },
    error: {
      title: "Couldn’t load the conversation",
      description: "Your draft is safe. Try loading the messages again.",
      Icon: CircleAlertIcon,
    },
    "access-lost": {
      title: "This conversation is no longer available",
      description:
        "You no longer have access. Contact the group admin if this seems wrong.",
      Icon: LockIcon,
    },
    removed: {
      title: "You were removed from this chat",
      description:
        "A host removed you. You can rejoin through your ticket invitation. Your ticket for the event is still valid.",
      Icon: UserXIcon,
    },
    banned: {
      title: "You were banned from this chat",
      description:
        "You can’t rejoin unless a host lifts the ban. Your ticket for the event is still valid.",
      Icon: BanIcon,
    },
    left: {
      title: "You left this chat",
      description:
        "You’ll no longer receive messages from this group. Your ticket for the event is still valid.",
      Icon: LogOutIcon,
    },
  };
  if (
    scenario !== "empty" &&
    scenario !== "error" &&
    scenario !== "access-lost" &&
    scenario !== "removed" &&
    scenario !== "banned" &&
    scenario !== "left"
  )
    return null;
  const { title, description, Icon } = content[scenario];
  return (
    <ChatEmptyState
      title={title}
      description={description}
      icon={<Icon aria-hidden="true" />}
    >
      {scenario === "empty" && !joined && (
        <div className="flex flex-col items-center gap-2">
          <Button onClick={onJoin}>Join chat</Button>
          <p className="text-muted-foreground text-xs">
            {memberCount} {memberCount === 1 ? "person is" : "people are"}{" "}
            already in the chat
          </p>
        </div>
      )}
      {scenario === "error" && (
        <Button variant="outline" size="sm" onClick={onRecover}>
          Try again
        </Button>
      )}
      {(scenario === "left" || scenario === "removed") && (
        <Button onClick={onRecover}>Rejoin chat</Button>
      )}
    </ChatEmptyState>
  );
}
