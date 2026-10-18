"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type React from "react";
import { cn } from "@/registry/default/lib/utils";

const AVATAR_GROUP_CUT =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E\")";

export function Avatar({
  className,
  ...props
}: AvatarPrimitive.Root.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative isolate inline-flex size-(--avatar-size,--spacing(8)) shrink-0 select-none items-center justify-center overflow-hidden rounded-full align-middle font-medium text-[calc(var(--avatar-size,--spacing(8))*0.375)]/none",
        className,
      )}
      data-slot="avatar"
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.Image.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "absolute inset-0 z-10 size-full rounded-[inherit] object-cover data-error:invisible data-loading:invisible",
        className,
      )}
      data-slot="avatar-image"
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props): React.ReactElement {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "absolute inset-0 flex size-full items-center justify-center rounded-[inherit] bg-border",
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  topmost?: "first" | "last";
}

export function AvatarGroup({
  className,
  style,
  topmost = "first",
  ...props
}: AvatarGroupProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex w-fit items-center",
        "[--avatar-group-size:var(--avatar-size,--spacing(8))]",
        "[--avatar-group-gap:var(--avatar-gap,calc(var(--avatar-group-size)/16))]",
        "[--avatar-group-overlap:var(--avatar-overlap,calc(var(--avatar-group-size)*0.3))]",
        "[--avatar-group-cut-end:calc(var(--avatar-group-size)*1.5-var(--avatar-group-overlap))]",
        "[--avatar-group-cut-radius:calc(var(--avatar-group-size)/2+var(--avatar-group-gap))]",
        "[--avatar-group-cut-start:calc(var(--avatar-group-overlap)-var(--avatar-group-size)/2)]",
        "[--avatar-group-mask-position:0_0,calc(var(--avatar-group-cut-x)-var(--avatar-group-cut-radius))_50%]",
        "[--avatar-group-mask-size:100%_100%,calc(var(--avatar-group-cut-radius)*2)_calc(var(--avatar-group-cut-radius)*2)]",
        "[--avatar-group-mask:none]",
        "supports-[mask-composite:subtract]:[--avatar-group-mask:var(--avatar-group-cut-image),var(--avatar-group-cut-image)]",
        "[--avatar-group-nudge:var(--avatar-nudge,calc((var(--avatar-group-overlap)+var(--avatar-group-gap))*0.3))]",
        "*:not-first:-ms-(--avatar-group-overlap)",
        topmost === "first"
          ? "*:not-first:mask-(--avatar-group-mask) [--avatar-group-cut-x:var(--avatar-group-cut-start)] *:not-first:*:data-[slot=avatar-fallback]:ps-[calc(var(--avatar-group-nudge)*2)] supports-[mask-composite:subtract]:*:not-first:rounded-none *:not-first:[mask-composite:subtract] *:not-first:[mask-position:var(--avatar-group-mask-position)] *:not-first:[mask-repeat:no-repeat] *:not-first:[mask-size:var(--avatar-group-mask-size)] rtl:[--avatar-group-cut-x:var(--avatar-group-cut-end)]"
          : "*:not-last:mask-(--avatar-group-mask) [--avatar-group-cut-x:var(--avatar-group-cut-end)] *:not-last:*:data-[slot=avatar-fallback]:pe-[calc(var(--avatar-group-nudge)*2)] supports-[mask-composite:subtract]:*:not-last:rounded-none *:not-last:[mask-composite:subtract] *:not-last:[mask-position:var(--avatar-group-mask-position)] *:not-last:[mask-repeat:no-repeat] *:not-last:[mask-size:var(--avatar-group-mask-size)] rtl:[--avatar-group-cut-x:var(--avatar-group-cut-start)]",
        className,
      )}
      data-slot="avatar-group"
      data-topmost={topmost}
      style={
        {
          "--avatar-group-cut-image": AVATAR_GROUP_CUT,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export function AvatarGroupCount({
  children,
  className,
  ...props
}: AvatarPrimitive.Root.Props): React.ReactElement {
  return (
    <Avatar
      className={cn("text-muted-foreground", className)}
      data-slot="avatar-group-count"
      {...props}
    >
      <AvatarFallback>{children}</AvatarFallback>
    </Avatar>
  );
}

export { AvatarPrimitive };
