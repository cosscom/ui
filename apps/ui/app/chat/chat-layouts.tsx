"use client";

import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/registry/default/ui/button";
import { DrawerTrigger } from "@/registry/default/ui/drawer";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";
import { ChatWindow, SampleConversation } from "./chat-sample";

function AppSidebar() {
  return (
    <div
      aria-hidden="true"
      className="hidden w-40 shrink-0 flex-col gap-3 border-e p-4 sm:flex"
    >
      <div className="mb-3 h-2.5 w-16 rounded-full bg-foreground/16" />
      {["w-24", "w-20", "w-28", "w-16", "w-22"].map((width) => (
        <div key={width} className={`h-2 rounded-full bg-muted ${width}`} />
      ))}
    </div>
  );
}

function AppContent() {
  return (
    <div aria-hidden="true" className="flex min-w-0 flex-1 flex-col gap-4 p-6">
      <div className="h-3 w-40 rounded-full bg-foreground/16" />
      <div className="h-2 w-64 max-w-full rounded-full bg-muted" />
      <div className="mt-2 grid flex-1 grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/72" />
        <div className="rounded-xl bg-muted/72" />
        <div className="col-span-2 rounded-xl bg-muted/72" />
      </div>
    </div>
  );
}

function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-128 overflow-hidden rounded-2xl border bg-background shadow-lg/5">
      {children}
    </div>
  );
}

export function ChatLayouts({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  return (
    <Tabs defaultValue="drawer" className="gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TabsList aria-label="Layouts">
          <TabsTab value="drawer">Drawer</TabsTab>
          <TabsTab value="panel">Side panel</TabsTab>
          <TabsTab value="page">Full page</TabsTab>
        </TabsList>
        <DrawerTrigger
          render={<Button variant="outline" />}
          onClick={onOpenDrawer}
        >
          Open a real drawer
          <ArrowUpRightIcon aria-hidden="true" />
        </DrawerTrigger>
      </div>
      <TabsPanel value="drawer">
        <AppFrame>
          <AppSidebar />
          <AppContent />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/4"
          />
          <ChatWindow className="absolute inset-3 rounded-xl border shadow-lg sm:start-auto sm:w-80">
            <SampleConversation />
          </ChatWindow>
        </AppFrame>
      </TabsPanel>
      <TabsPanel value="panel">
        <AppFrame>
          <AppSidebar />
          <div className="hidden min-w-0 flex-1 md:flex">
            <AppContent />
          </div>
          <ChatWindow className="w-full border-s md:w-80">
            <SampleConversation />
          </ChatWindow>
        </AppFrame>
      </TabsPanel>
      <TabsPanel value="page">
        <AppFrame>
          <AppSidebar />
          <ChatWindow className="flex-1">
            <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
              <SampleConversation />
            </div>
          </ChatWindow>
        </AppFrame>
      </TabsPanel>
    </Tabs>
  );
}
