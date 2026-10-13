"use client";

import { CircleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ChatEmptyState,
  ChatLoadingState,
  ChatStatusBar,
} from "@/registry/default/chat/chat-states";
import { ChatDemoComposer } from "@/registry/default/chat-demo/chat-demo-composer";
import { ChatTimelineState } from "@/registry/default/chat-demo/chat-demo-scenarios";
import { Button } from "@/registry/default/ui/button";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";
import { ChatWindow, SampleConversation } from "./chat-sample";

const STATES = [
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "reconnecting", label: "Reconnecting" },
  { value: "error", label: "Error" },
  { value: "no-access", label: "No access" },
] as const;

function useTimeout() {
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (callback: () => void, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(callback, delay);
  };
}

function LoadingState() {
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  if (loaded) return <SampleConversation focusComposer />;
  return (
    <>
      <div className="min-h-0 flex-1">
        <ScrollArea overscrollContain>
          <div className="px-4">
            <ChatLoadingState label="Loading conversation">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLoaded(true)}
              >
                Finish loading preview
              </Button>
            </ChatLoadingState>
          </div>
        </ScrollArea>
      </div>
      <ChatDemoComposer
        inputRef={inputRef}
        mentionMembers={["maya", "jordan", "alex"]}
        notice=""
        disabled
        value={[]}
        onValueChange={() => {}}
        onSend={() => {}}
      />
    </>
  );
}

function EmptyState() {
  const [joined, setJoined] = useState(false);
  if (joined) return <SampleConversation empty focusComposer />;
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <ChatTimelineState
        scenario="empty"
        joined={false}
        memberCount={3}
        onRecover={() => {}}
        onJoin={() => setJoined(true)}
      />
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
      disabled={status !== "online"}
      focusComposer={status === "online"}
      notice={status === "online" ? "Connected" : ""}
      banner={
        status !== "online" && (
          <ChatStatusBar
            title={status === "offline" ? "You’re offline" : "Reconnecting…"}
            description="Your draft is saved here. Sending will resume when connected."
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
                Reconnect
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
  if (status === "loaded") return <SampleConversation focusComposer />;
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <ChatEmptyState
        icon={<CircleAlertIcon aria-hidden="true" />}
        title="Couldn’t load the conversation"
        description="Your draft is safe. Try loading the messages again."
      >
        <Button
          variant="outline"
          size="sm"
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
  const [restored, setRestored] = useState(false);
  if (restored) return <SampleConversation focusComposer />;
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <ChatTimelineState
        scenario="removed"
        onRecover={() => setRestored(true)}
        joined={false}
        memberCount={3}
        onJoin={() => {}}
      />
    </div>
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
