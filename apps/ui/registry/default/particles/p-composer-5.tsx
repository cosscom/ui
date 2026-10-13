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
  useComposerFilter,
} from "@/registry/default/ui/composer";

const people = [
  { id: "alex", label: "Álex Morgan", description: "Design" },
  { id: "sam", label: "Sam Rivera", description: "Engineering" },
  { id: "taylor", label: "Taylor Kim", description: "Product" },
  { id: "jordan", label: "Jordan Lee", description: "Marketing" },
  { id: "casey", label: "Casey Chen", description: "Support" },
  { id: "morgan", label: "Morgan Davis", description: "Operations" },
  { id: "jamie", label: "Jamie Wilson", description: "Finance" },
  { id: "riley", label: "Riley Patel", description: "Research" },
];

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const { startsWith } = useComposerFilter();

  return (
    <Composer
      className="w-full max-w-xl"
      value={value}
      onValueChange={setValue}
      onSubmit={() => setValue([])}
      triggers={[
        {
          character: "@",
          items: people,
          filter: (item, query) => startsWith(item.label, query),
        },
      ]}
    >
      <ComposerInput
        aria-label="Team message"
        placeholder="Mention a teammate…"
      />
      <ComposerPopup>
        <ComposerList>
          {(item: ComposerItemValue) => (
            <ComposerItem key={item.id} value={item}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{item.label}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {item.description}
                </span>
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
  );
}
