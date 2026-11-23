"use client";

// PROTOTYPE ONLY. A verbatim copy of Cal's shared SelectionList
// (calcom/cal `packages/coss-ui/src/shared/selection-list.tsx`), the list of
// chosen people under HostSelect. Only the import paths differ.

import { XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { ScrollArea } from "@/registry/default/ui/scroll-area";

export type SelectionListProps = React.ComponentProps<"div"> & {
  scrollable?: boolean;
};

export function SelectionList({
  className,
  scrollable = true,
  ...props
}: SelectionListProps): React.ReactElement {
  const list = (
    <div
      className={cn(
        "divide-y bg-card text-card-foreground",
        !scrollable && "overflow-hidden rounded-lg border",
        className,
      )}
      data-slot="selection-list"
      role="list"
      {...props}
    />
  );

  if (!scrollable) return list;

  return (
    <ScrollArea
      className="overflow-hidden rounded-lg border *:data-[slot=scroll-area-viewport]:data-has-overflow-y:**:data-[slot=selection-list-item]:pe-3 *:data-[slot=scroll-area-viewport]:max-h-96"
      scrollFade
    >
      {list}
    </ScrollArea>
  );
}

export type SelectionListItemProps = React.ComponentProps<"div"> & {
  trailing?: React.ReactNode;
} & (
    | {
        onRemove: () => void;
        removeAriaLabel: string;
      }
    | {
        onRemove?: never;
        removeAriaLabel?: never;
      }
  );

export function SelectionListItem({
  className,
  onRemove,
  removeAriaLabel,
  children,
  trailing,
  ...props
}: SelectionListItemProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-1 ps-2 text-base sm:text-sm",
        className,
      )}
      data-slot="selection-list-item"
      role="listitem"
      {...props}
    >
      {children}
      {trailing || onRemove ? (
        <div className="ms-auto flex shrink-0 items-center gap-1.5">
          {trailing}
          {onRemove ? (
            <Button
              aria-label={removeAriaLabel}
              onClick={onRemove}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <XIcon aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
