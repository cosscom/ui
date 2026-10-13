"use client";

import { CircleAlertIcon, LockIcon, MessageCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ChatComposer } from "@/registry/default/chat/chat-composer";
import {
  ChatEmptyState,
  ChatLoadingState,
  ChatStatusBar,
} from "@/registry/default/chat/chat-states";
import { Button } from "@/registry/default/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";
import { ChatWindow, SampleConversation } from "./chat-sample";

const STATES = [
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "reconnecting", label: "Reconnecting" },
  { value: "error", label: "Error" },
  { value: "no-access", label: "No access" },
] as const;

const ACCESS = {
  removed: {
    label: "Removed",
    title: "You were removed from this chat",
    description: "You can rejoin at any time.",
    action: "Rejoin",
  },
  banned: {
    label: "Banned",
    title: "You were banned from this chat",
    description: "An admin needs to lift the ban before you can post again.",
    action: null,
  },
  "access-lost": {
    label: "Access lost",
    title: "You no longer have access",
    description: "Your permissions changed. Ask an admin to add you back.",
    action: "Request access",
  },
} as const;

function useTimeout() {
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (callback: () => void, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(callback, delay);
  };
}

function LoadingState() {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-hidden px-4">
        <ChatLoadingState label="Loading conversation" />
      </div>
      <ChatComposer
        compact
        disabled
        className="px-3 pt-3 pb-3"
        draft=""
        onDraftChange={() => {}}
        onSend={() => {}}
        textareaLabel="Message"
        sendLabel="Send message"
        placeholder="Message the group…"
      />
    </>
  );
}

function EmptyState() {
  const [joined, setJoined] = useState(false);
  if (joined) return <SampleConversation />;
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center">
      <ChatEmptyState
        icon={<MessageCircleIcon aria-hidden="true" />}
        title="Join the conversation"
        description="Only people who join can read and send messages."
      >
        <Button onClick={() => setJoined(true)}>Join chat</Button>
      </ChatEmptyState>
    </div>
  );
}

function ReconnectingState() {
  const [status, setStatus] = useState<"offline" | "retrying" | "online">(
    "offline",
  );
  const later = useTimeout();
  return (
    <SampleConversation
      banner={
        status !== "online" && (
          <ChatStatusBar
            title={status === "offline" ? "You’re offline" : "Reconnecting…"}
            description="Your draft is saved. Sending resumes when you’re back."
            action={
              <Button
                variant="outline"
                size="xs"
                loading={status === "retrying"}
                onClick={() => {
                  setStatus("retrying");
                  later(() => setStatus("online"), 1200);
                }}
              >
                Try now
              </Button>
            }
          />
        )
      }
    />
  );
}

function ErrorState() {
  const [status, setStatus] = useState<"error" | "retrying" | "loaded">(
    "error",
  );
  const later = useTimeout();
  if (status === "loaded") return <SampleConversation />;
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center">
      <ChatEmptyState
        icon={<CircleAlertIcon aria-hidden="true" />}
        title="Couldn’t load the conversation"
        description="Your draft is safe. Try loading the messages again."
      >
        <Button
          variant="outline"
          loading={status === "retrying"}
          onClick={() => {
            setStatus("retrying");
            later(() => setStatus("loaded"), 1000);
          }}
        >
          Try again
        </Button>
      </ChatEmptyState>
    </div>
  );
}

function NoAccessState() {
  const [reason, setReason] = useState<keyof typeof ACCESS>("removed");
  const [restored, setRestored] = useState(false);
  if (restored) return <SampleConversation />;
  const content = ACCESS[reason];
  return (
    <SampleConversation
      footer={
        <div className="flex shrink-0 flex-col items-center gap-3 border-t px-4 py-4 text-center">
          <Tabs
            value={reason}
            onValueChange={(value) => setReason(value as keyof typeof ACCESS)}
          >
            <TabsList variant="underline" aria-label="Reason">
              {Object.entries(ACCESS).map(([value, item]) => (
                <TabsTab key={value} value={value}>
                  {item.label}
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-start gap-2 text-start">
            <LockIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            />
            <div className="text-sm" role="status">
              <p className="font-medium">{content.title}</p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                {content.description}
              </p>
            </div>
          </div>
          {content.action && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRestored(true)}
            >
              {content.action}
            </Button>
          )}
        </div>
      }
    />
  );
}

export function ChatStatesSection() {
  return (
    <Tabs defaultValue="loading" className="items-center gap-6">
      <TabsList
        aria-label="Conversation states"
        className="max-w-full overflow-x-auto"
      >
        {STATES.map((state) => (
          <TabsTab key={state.value} value={state.value}>
            {state.label}
          </TabsTab>
        ))}
      </TabsList>
      <div className="w-full max-w-md">
        <TabsPanel value="loading">
          <StateFrame>
            <LoadingState />
          </StateFrame>
        </TabsPanel>
        <TabsPanel value="empty">
          <StateFrame>
            <EmptyState />
          </StateFrame>
        </TabsPanel>
        <TabsPanel value="reconnecting">
          <StateFrame>
            <ReconnectingState />
          </StateFrame>
        </TabsPanel>
        <TabsPanel value="error">
          <StateFrame>
            <ErrorState />
          </StateFrame>
        </TabsPanel>
        <TabsPanel value="no-access">
          <StateFrame>
            <NoAccessState />
          </StateFrame>
        </TabsPanel>
      </div>
    </Tabs>
  );
}

function StateFrame({ children }: { children: ReactNode }) {
  return (
    <ChatWindow className="h-128 rounded-2xl border shadow-lg/5">
      {children}
    </ChatWindow>
  );
}
