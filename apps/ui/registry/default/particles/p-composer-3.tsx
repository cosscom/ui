"use client";

import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerItem,
  type ComposerItemValue,
  ComposerList,
  ComposerPopup,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";
import {
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer";

const blocks = Array.from({ length: 32 }, (_, index) => `block-${index}`);

const people = [
  { id: "alex", label: "Alex Morgan" },
  { id: "sam", label: "Sam Rivera" },
];

const actions = [
  { id: "summarize", label: "Summarize", type: "action" as const },
  { id: "rewrite", label: "Rewrite", type: "action" as const },
];

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [activity, setActivity] = useState("");

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open composer drawer
      </DrawerTrigger>
      <DrawerPopup
        className="[--drawer-height:calc(100dvh-3rem)]"
        keyboardAware
        showBar
        showCloseButton
      >
        <DrawerHeader>
          <DrawerTitle>Chat</DrawerTitle>
          {activity && (
            <p className="text-muted-foreground text-xs" role="status">
              {activity}
            </p>
          )}
        </DrawerHeader>
        <div className="min-h-0 flex-1">
          <DrawerPanel>
            <div aria-hidden="true" className="flex flex-col gap-2">
              {blocks.map((key) => (
                <div className="h-12 shrink-0 rounded-xl bg-muted" key={key} />
              ))}
            </div>
          </DrawerPanel>
        </div>
        <Composer
          className="mx-3 mb-3"
          value={value}
          onValueChange={setValue}
          onSubmit={(message) => {
            setActivity(`Sent: ${getComposerText(message)}`);
            setValue([]);
          }}
          triggers={[
            { character: "@", items: people },
            { character: "/", items: actions },
          ]}
        >
          <ComposerInput aria-label="Message" placeholder="Write a message…" />
          <ComposerPopup>
            <ComposerList>
              {(item: ComposerItemValue) => (
                <ComposerItem key={item.id} value={item}>
                  {item.label}
                </ComposerItem>
              )}
            </ComposerList>
          </ComposerPopup>
          <ComposerActions>
            <ComposerActionGroup align="end">
              <ComposerSubmit
                render={
                  <Button aria-label="Send message" size="icon">
                    <ArrowUpIcon aria-hidden="true" />
                  </Button>
                }
              />
            </ComposerActionGroup>
          </ComposerActions>
        </Composer>
      </DrawerPopup>
    </Drawer>
  );
}
