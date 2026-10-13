"use client";

import { ArrowUpIcon } from "lucide-react";
import type { ReactElement, RefObject } from "react";
import { useId, useMemo } from "react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { cn } from "@/registry/default/lib/utils";
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
} from "@/registry/default/ui/composer";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { ChatMemberAvatar } from "./chat-demo-message";
import type { MemberId } from "./chat-demo-state";
import { CHAT_MEMBERS } from "./chat-demo-state";

function isMemberId(id: string): id is MemberId {
  return Object.hasOwn(CHAT_MEMBERS, id);
}

function mentionMatchesHandle(item: ComposerItemValue, query: string): boolean {
  return item.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
}

export function ChatDemoComposer({
  className,
  value,
  onValueChange,
  replyAuthor,
  placeholder = "Message the group…",
  mentionMembers,
  onSend,
  inputRef,
  notice,
  disabled = false,
}: {
  className?: string;
  value: ComposerValue;
  onValueChange: (value: ComposerValue) => void;
  replyAuthor?: string;
  placeholder?: string;
  mentionMembers: readonly MemberId[];
  onSend: () => void;
  inputRef: RefObject<HTMLDivElement | null>;
  notice: string;
  disabled?: boolean;
}): ReactElement {
  const hintId = useId();
  const touchInput = useMediaQuery({ pointer: "coarse" });
  const triggers = useMemo<ComposerTrigger[]>(
    () => [
      {
        character: "@",
        filter: mentionMatchesHandle,
        items: mentionMembers.map((id) => ({
          id,
          label: CHAT_MEMBERS[id].handle,
        })),
      },
    ],
    [mentionMembers],
  );

  return (
    <div
      className={cn(
        "relative z-20 flex shrink-0 flex-col gap-2.5 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
        className,
      )}
    >
      <Composer
        className="[--composer-max-rows:4] data-disabled:opacity-50 max-md:data-[layout=adaptive]:not-data-multiline:px-1 max-md:[--composer-min-rows:1] max-md:[--composer-padding:--spacing(1)] max-md:[--composer-radius:calc(--spacing(5.5)+1px)] sm:max-md:[--composer-radius:calc(--spacing(5)+1px)] md:[--composer-max-rows:6] md:[--composer-min-rows:2] pointer-coarse:[&_[data-slot=composer-scroll-area]_[data-slot=scroll-area-scrollbar]]:hidden"
        disabled={disabled}
        layout="adaptive"
        submitOnEnter="desktop"
        triggers={triggers}
        value={value}
        onSubmit={onSend}
        onValueChange={onValueChange}
      >
        <ComposerInput
          ref={inputRef}
          aria-describedby={touchInput ? undefined : hintId}
          aria-label="Message"
          className="max-md:px-2"
          placeholder={replyAuthor ? `Reply to ${replyAuthor}…` : placeholder}
        />
        <ComposerPopup>
          <ComposerList>
            {(item: ComposerItemValue) => {
              if (!isMemberId(item.id)) return null;
              return (
                <ComposerItem key={item.id} value={item}>
                  <ChatMemberAvatar
                    className="size-4 text-[0.5rem]"
                    member={item.id}
                  />
                  <span className="min-w-0 truncate">
                    {CHAT_MEMBERS[item.id].name}
                  </span>
                </ComposerItem>
              );
            }}
          </ComposerList>
        </ComposerPopup>
        <ComposerActions className="max-md:mx-1">
          <ComposerActionGroup align="end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <ComposerSubmit
                    aria-label="Send message"
                    render={
                      <Button
                        aria-label="Send message"
                        className="rounded-full before:rounded-full"
                        size="icon"
                      >
                        <ArrowUpIcon
                          aria-hidden="true"
                          className="size-4 md:size-4.5"
                        />
                      </Button>
                    }
                  />
                }
              />
              <TooltipPopup side="bottom">Send message</TooltipPopup>
            </Tooltip>
          </ComposerActionGroup>
        </ComposerActions>
      </Composer>
      <div
        className={cn(
          touchInput && !notice
            ? "sr-only"
            : "flex min-h-4 items-center justify-between px-1 text-muted-foreground text-xs",
          disabled && "opacity-50",
        )}
      >
        <span aria-live="polite" role="status">
          {notice}
        </span>
        {!touchInput && (
          <span
            className={notice ? "sr-only" : "ms-auto pointer-coarse:hidden"}
            id={hintId}
          >
            Enter to send <span className="px-1.5 opacity-40">/</span> Shift +
            Enter for a new line
          </span>
        )}
      </div>
    </div>
  );
}
