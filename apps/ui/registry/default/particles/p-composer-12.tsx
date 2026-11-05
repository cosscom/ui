"use client";

import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { searchEmoji } from "@/registry/default/chat-demo/chat-demo-emoji";
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

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [emoji, setEmoji] = useState<ComposerItemValue[]>([]);
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Composer
        value={value}
        onValueChange={setValue}
        onQueryChange={(query) =>
          setEmoji(query?.character === ":" ? searchEmoji(query.text) : [])
        }
        triggers={[{ character: ":", items: emoji, filter: null }]}
        onSubmit={(draft) => {
          setNotice(`Sent: ${getComposerText(draft)}`);
          setValue([]);
        }}
      >
        <ComposerInput aria-label="Message" placeholder="Type :thu for 👍" />
        <ComposerPopup>
          <ComposerList>
            {(item: ComposerItemValue) => (
              <ComposerItem key={item.id} value={item}>
                <span className="shrink-0 text-xl/none">{item.text}</span>
                <span className="truncate text-muted-foreground">
                  :{item.label}:
                </span>
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
      <p aria-live="polite" className="text-muted-foreground text-sm">
        {notice}
      </p>
    </div>
  );
}
