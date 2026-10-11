"use client";

import { ArrowUpIcon, AtSignIcon, SquareSlashIcon } from "lucide-react";
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
  type ComposerTrigger,
  type ComposerValue,
  useComposerContext,
} from "@/registry/default/ui/composer";

const triggers: ComposerTrigger[] = [
  {
    character: "@",
    items: [
      { id: "alex", label: "Alex Morgan" },
      { id: "sam", label: "Sam Rivera" },
    ],
  },
  {
    character: "/",
    items: [
      { id: "summarize", label: "Summarize", type: "action" },
      { id: "rewrite", label: "Rewrite", type: "action" },
    ],
  },
];

function TriggerActions() {
  const { disabled, readOnly, insertTrigger } = useComposerContext();

  return (
    <ComposerActionGroup>
      <Button
        aria-label="Mention someone"
        disabled={disabled || readOnly}
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => insertTrigger("@")}
      >
        <AtSignIcon aria-hidden="true" />
      </Button>
      <Button
        aria-label="Insert an action"
        disabled={disabled || readOnly}
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => insertTrigger("/")}
      >
        <SquareSlashIcon aria-hidden="true" />
      </Button>
    </ComposerActionGroup>
  );
}

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);

  return (
    <Composer
      className="w-full max-w-xl"
      value={value}
      onValueChange={setValue}
      onSubmit={() => setValue([])}
      triggers={triggers}
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
        <TriggerActions />
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
  );
}
