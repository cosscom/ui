"use client";

import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/default/ui/composer";

export default function Particle() {
  const [value, setValue] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Composer
        onSubmit={() => {
          if (!value.trim()) return;
          setNotice(`Sent: ${value}`);
          setValue("");
        }}
      >
        <ComposerInput
          render={
            <textarea
              aria-label="Plain message"
              onChange={(event) => setValue(event.target.value)}
              placeholder="Write a message…"
              value={value}
            />
          }
        />
        <ComposerActions>
          <ComposerActionGroup>
            <Button
              aria-label="Attach a file"
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setNotice("Attach a file")}
            >
              <PaperclipIcon aria-hidden="true" />
            </Button>
          </ComposerActionGroup>
          <ComposerActionGroup align="end">
            <ComposerSubmit
              disabled={!value.trim()}
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
