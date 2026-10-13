"use client";

import { ArrowUpIcon } from "lucide-react";
import { useId } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
} from "@/registry/default/ui/composer";

export function ChatInlineComposer({
  value,
  onValueChange,
  onSubmit,
  disabled = false,
}: {
  value: ComposerValue;
  onValueChange: (value: ComposerValue) => void;
  onSubmit: (value: ComposerValue) => void;
  disabled?: boolean;
}) {
  const hintId = useId();
  const touchInput = useMediaQuery({ pointer: "coarse" });
  return (
    <div className="flex shrink-0 flex-col gap-2.5 px-4 pb-4">
      <Composer
        disabled={disabled}
        submitOnEnter="desktop"
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSubmit}
      >
        <ComposerInput
          aria-describedby={touchInput ? undefined : hintId}
          aria-label="Message"
          placeholder="Write a message…"
          render={<textarea />}
        />
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
      {!touchInput && (
        <p id={hintId} className="text-end text-muted-foreground text-xs">
          Enter to send / Shift + Enter for a new line
        </p>
      )}
    </div>
  );
}
