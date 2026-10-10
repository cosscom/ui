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
  DrawerClose,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer";

const people = [
  { id: "alex", label: "Alex Morgan" },
  { id: "sam", label: "Sam Rivera" },
];

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [messages, setMessages] = useState(["How can I help today?"]);

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open chat drawer
      </DrawerTrigger>
      <DrawerPopup keyboardAware showBar>
        <DrawerHeader className="flex items-center justify-between gap-3">
          <DrawerTitle>Chat</DrawerTitle>
          <DrawerClose render={<Button size="sm" variant="ghost" />}>
            Close
          </DrawerClose>
        </DrawerHeader>
        <div className="min-h-0 flex-1">
          <DrawerPanel>
            <div className="flex flex-col gap-3" role="log">
              {messages.map((message, index) => (
                <p
                  className="max-w-[85%] rounded-xl bg-muted px-3 py-2 text-sm even:ms-auto even:bg-accent"
                  key={`${index}-${message}`}
                >
                  {message}
                </p>
              ))}
            </div>
          </DrawerPanel>
        </div>
        <Composer
          className="mx-3 mb-3 shrink-0"
          value={value}
          onValueChange={setValue}
          onSubmit={(message) => {
            setMessages((items) => [...items, getComposerText(message)]);
            setValue([]);
          }}
          triggers={[{ character: "@", items: people }]}
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
