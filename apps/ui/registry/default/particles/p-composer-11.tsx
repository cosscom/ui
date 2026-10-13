"use client";

import { ArrowUpIcon } from "lucide-react";
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
        className="rounded-[calc(--spacing(5.5)+1px)] [--composer-padding:--spacing(1)] before:rounded-[--spacing(5.5)] data-[layout=adaptive]:not-data-multiline:px-[calc(--spacing(1)-1px)] sm:rounded-[calc(--spacing(5)+1px)] sm:before:rounded-[--spacing(5)]"
        layout="adaptive"
        value={value}
        onValueChange={setValue}
        onSubmit={(draft) => {
          setNotice(`Sent: ${getComposerText(draft)}`);
          setValue([]);
        }}
      >
        <ComposerInput
          aria-label="Message"
          className="px-2"
          placeholder="Write a message…"
        />
        <ComposerActions className="mx-[calc(--spacing(1)-1px)]">
          <ComposerActionGroup align="end">
            <ComposerSubmit
              render={
                <Button
                  aria-label="Send message"
                  className="rounded-full"
                  size="icon"
                >
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
