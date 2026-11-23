"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Skeleton } from "@/registry/default/ui/skeleton";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { type BookerAvatar, getInitials } from "@/lib/booker/utils";

type BookerAvatarsProps = {
  avatars?: BookerAvatar[];
  fallbackName?: string;
};

export function BookerAvatars({ avatars, fallbackName }: BookerAvatarsProps) {
  if (!fallbackName) {
    return (
      <Avatar className="@3xl:@max-5xl:size-12 size-14 outline-2 outline-background">
        <AvatarFallback className="bg-transparent">
          <Skeleton className="size-full rounded-full" />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (avatars && avatars.length === 0) {
    return null;
  }

  const visibleAvatars =
    avatars && avatars.length > 0
      ? avatars
      : [{ avatarUrl: "", name: fallbackName, profileUrl: "" }];
  const firstAvatar = visibleAvatars[0];

  if (visibleAvatars.length === 1 && firstAvatar) {
    return (
      <a
        aria-label={firstAvatar.name}
        className="w-fit rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        href={firstAvatar.profileUrl || "#"}
        rel={firstAvatar.profileUrl ? "noreferrer" : undefined}
        target={firstAvatar.profileUrl ? "_blank" : undefined}
      >
        <Avatar className="@3xl:@max-5xl:size-12 size-14 outline-2 outline-background">
          {firstAvatar.avatarUrl ? (
            <AvatarImage alt={firstAvatar.name} src={firstAvatar.avatarUrl} />
          ) : null}
          <AvatarFallback>{getInitials(firstAvatar.name)}</AvatarFallback>
        </Avatar>
      </a>
    );
  }

  // Each avatar is the link itself, so AvatarGroup's overlap and cut-outs
  // apply to it directly.
  return (
    <TooltipProvider>
      <AvatarGroup>
        {visibleAvatars.map((avatar, index) => (
          <Tooltip key={`${avatar.name}-${avatar.avatarUrl}-${index}`}>
            <TooltipTrigger
              render={
                <Avatar
                  aria-label={avatar.name}
                  className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  render={
                    // biome-ignore lint/a11y/useAnchorContent: the avatar is the content
                    <a
                      href={avatar.profileUrl || "#"}
                      rel={avatar.profileUrl ? "noreferrer" : undefined}
                      target={avatar.profileUrl ? "_blank" : undefined}
                    />
                  }
                />
              }
            >
              {avatar.avatarUrl ? (
                <AvatarImage alt={avatar.name} src={avatar.avatarUrl} />
              ) : null}
              <AvatarFallback>{getInitials(avatar.name)}</AvatarFallback>
            </TooltipTrigger>
            <TooltipPopup>{avatar.name}</TooltipPopup>
          </Tooltip>
        ))}
      </AvatarGroup>
    </TooltipProvider>
  );
}
