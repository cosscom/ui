"use client";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  MessagesSquareIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChatDemo } from "@/registry/default/chat-demo/chat-demo";
import { CHAT_SCENARIOS } from "@/registry/default/chat-demo/chat-demo-state";
import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { DrawerTrigger } from "@/registry/default/ui/drawer";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";
import { ChatFeatures } from "./chat-features";
import { ChatLayouts } from "./chat-layouts";
import { ChatPreview } from "./chat-preview";
import { ChatStatesSection } from "./chat-states-section";

const COMPONENT_MAP = [
  { area: "Conversation", components: ["ChatConversation", "useChatScroll"] },
  {
    area: "Messages",
    components: ["ChatMessage", "ChatMessageText", "ChatCollapsibleMessage"],
  },
  {
    area: "Composer",
    components: ["Composer", "ComposerInput", "ComposerPopup"],
  },
  {
    area: "Actions",
    components: [
      "ChatMessageActionToolbar",
      "ChatReactionPicker",
      "ChatReactionChip",
    ],
  },
  {
    area: "Replies",
    components: ["ChatReplyReference", "ChatReplyPreview"],
  },
  {
    area: "Timeline",
    components: ["ChatDatePill", "ChatUnreadDivider", "ChatTypingIndicator"],
  },
  {
    area: "Delivery",
    components: ["ChatDeliveryIndicator", "ChatMessageInfo"],
  },
  {
    area: "States",
    components: ["ChatEmptyState", "ChatLoadingState", "ChatStatusBar"],
  },
];

function InstallCommand({ command }: { command: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  return (
    <Button
      className="justify-between gap-3 font-normal text-muted-foreground"
      variant="outline"
      aria-label={isCopied ? "Install command copied" : "Copy install command"}
      onClick={() => copyToClipboard(command)}
    >
      <code className="text-xs">
        <span aria-hidden="true" className="me-2 opacity-50">
          $
        </span>
        {command}
      </code>
      {isCopied ? (
        <CheckIcon aria-hidden="true" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}
    </Button>
  );
}

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="mb-10 max-w-xl">
      <h2
        id={id}
        className="font-bold font-heading text-3xl tracking-tight md:text-4xl"
      >
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
  );
}

export function ChatShowcase() {
  return (
    <ChatDemo
      renderTriggers={(select) => (
        <>
          <section className="container grid items-center gap-12 py-14 md:grid-cols-2 md:gap-14 md:py-20 lg:gap-24">
            <div className="flex min-w-0 flex-col items-start">
              <Badge
                variant="outline"
                className="mb-6 h-7 gap-1.5 rounded-full px-2.5 text-xs shadow-xs/5 sm:h-7"
              >
                <MessagesSquareIcon aria-hidden="true" className="size-3.5" />
                Chat UI
              </Badge>
              <h1 className="font-bold font-heading text-5xl leading-none tracking-tight lg:text-6xl">
                Make room
                <br />
                for conversation.
              </h1>
              <p className="mt-6 max-w-md text-pretty text-lg text-muted-foreground">
                Chat components for React with replies, reactions, mentions, and
                delivery states built in. Copy the source and make it yours.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <DrawerTrigger
                  render={<Button size="lg" />}
                  onClick={() => select("conversation")}
                >
                  Open the full demo
                  <ArrowUpRightIcon aria-hidden="true" />
                </DrawerTrigger>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/docs/chat" />}
                >
                  Read the docs
                </Button>
              </div>
              <div className="mt-5">
                <InstallCommand command="npx shadcn@latest add @coss/chat" />
              </div>
              <p className="mt-8 text-muted-foreground text-xs">
                Built with Base UI, Tailwind CSS, and Motion
              </p>
            </div>
            <div className="mx-auto w-full max-w-md">
              <Tabs defaultValue="direct" className="gap-4">
                <TabsList
                  aria-label="Conversation type"
                  className="self-center"
                >
                  <TabsTab value="direct">Direct message</TabsTab>
                  <TabsTab value="group">Group chat</TabsTab>
                </TabsList>
                <TabsPanel value="direct">
                  <ChatPreview direct />
                </TabsPanel>
                <TabsPanel value="group">
                  <ChatPreview />
                </TabsPanel>
              </Tabs>
            </div>
          </section>

          <section
            aria-labelledby="chat-features"
            className="border-t bg-muted/24"
          >
            <div className="container py-14 md:py-20">
              <SectionHeading
                id="chat-features"
                title="Every part of a conversation"
                description="Each tile below is the real component. Click, hover, and type to try it."
              />
              <ChatFeatures />
            </div>
          </section>

          <section aria-labelledby="chat-states" className="border-t">
            <div className="container py-14 md:py-20">
              <SectionHeading
                id="chat-states"
                title="Ready for when things go wrong"
                description="Loading, empty, offline, errors, and lost access. Recovery actions respect whether the member can still access the chat."
              />
              <ChatStatesSection />
              <div
                className="mt-8 flex flex-wrap justify-center gap-2"
                aria-label="Explore drawer states"
              >
                {CHAT_SCENARIOS.filter(
                  ({ value }) => value !== "conversation",
                ).map(({ value, label }) => (
                  <DrawerTrigger
                    key={value}
                    render={<Button variant="outline" size="xs" />}
                    onClick={() => select(value)}
                  >
                    {label}
                  </DrawerTrigger>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="chat-layouts"
            className="border-t bg-muted/24"
          >
            <div className="container py-14 md:py-20">
              <SectionHeading
                id="chat-layouts"
                title="Fits wherever you need it"
                description="The same components work in a drawer, a side panel, or a full page."
              />
              <ChatLayouts onOpenDrawer={() => select("conversation")} />
            </div>
          </section>

          <section aria-labelledby="chat-build" className="border-t">
            <div className="container grid gap-12 py-14 md:grid-cols-[2fr_3fr] md:py-20">
              <div className="flex flex-col items-start">
                <h2
                  id="chat-build"
                  className="font-bold font-heading text-3xl tracking-tight md:text-4xl"
                >
                  Start building
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Install the components, or start from the complete drawer
                  example with sample data. Your app supplies messages,
                  persistence, and permissions.
                </p>
                <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
                  <InstallCommand command="npx shadcn@latest add @coss/chat" />
                  <InstallCommand command="npx shadcn@latest add @coss/chat-demo" />
                </div>
                <Button
                  className="mt-6"
                  variant="outline"
                  render={<Link href="/docs/chat" />}
                >
                  Read the docs
                  <ArrowRightIcon aria-hidden="true" />
                </Button>
              </div>
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {COMPONENT_MAP.map((item) => (
                  <div key={item.area} className="border-t pt-4">
                    <dt className="font-medium text-sm">{item.area}</dt>
                    <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {item.components.map((component) => (
                        <code
                          key={component}
                          className="text-muted-foreground text-xs"
                        >
                          {component}
                        </code>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </>
      )}
    />
  );
}
