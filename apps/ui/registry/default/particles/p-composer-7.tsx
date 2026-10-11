"use client";

import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from "@/registry/default/ui/composer";

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Composer
        layout="adaptive"
        value={value}
        onValueChange={setValue}
        onSubmit={(draft) => {
          setNotice(`Sent: ${getComposerText(draft)}`);
          setValue([]);
        }}
      >
        <ComposerInput aria-label="Message" placeholder="Write a message…" />
        <ComposerActions>
          <ComposerActionGroup>
            <Button
              aria-label="Add an attachment"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setNotice("Add an attachment")}
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          </ComposerActionGroup>
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
