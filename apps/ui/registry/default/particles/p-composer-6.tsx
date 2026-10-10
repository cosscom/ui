"use client";

import {
  ArrowUpIcon,
  SparklesIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
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
  ComposerToken,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";

const people = [
  { id: "alex", label: "Alex Morgan", kind: "person" },
  { id: "sam", label: "Sam Rivera", kind: "person" },
];

const teams = [
  { id: "design", label: "Design team", kind: "team" },
  { id: "engineering", label: "Engineering team", kind: "team" },
];

const actions = [
  { id: "summarize", label: "Summarize", type: "action" as const },
  { id: "rewrite", label: "Rewrite", type: "action" as const },
];

const triggers: ComposerTrigger[] = [
  { character: "@", items: [...people, ...teams] },
  { character: "/", items: actions },
];

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Composer
        value={value}
        onValueChange={setValue}
        triggers={triggers}
        onSubmit={(draft) => {
          setNotice(`Sent: ${getComposerText(draft)}`);
          setValue([]);
        }}
      >
        <ComposerInput
          aria-label="Message"
          placeholder="Write a message…"
          renderToken={(token) => (
            <ComposerToken
              token={token}
              variant="chip"
              icon={
                token.type === "action" ? (
                  <SparklesIcon aria-hidden="true" />
                ) : token.kind === "team" ? (
                  <UsersRoundIcon aria-hidden="true" />
                ) : (
                  <UserRoundIcon aria-hidden="true" />
                )
              }
            />
          )}
        />
        <ComposerPopup>
          <ComposerList>
            {(item: ComposerItemValue) => (
              <ComposerItem key={item.id} value={item}>
                {item.type === "action" ? (
                  <SparklesIcon
                    aria-hidden="true"
                    className="size-4 opacity-80"
                  />
                ) : item.kind === "team" ? (
                  <UsersRoundIcon
                    aria-hidden="true"
                    className="size-4 opacity-80"
                  />
                ) : (
                  <UserRoundIcon
                    aria-hidden="true"
                    className="size-4 opacity-80"
                  />
                )}
                <span className="truncate">{item.label}</span>
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
      <p className="min-h-5 text-muted-foreground text-sm" role="status">
        {notice}
      </p>
    </div>
  );
}
