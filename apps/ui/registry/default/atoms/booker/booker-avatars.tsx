"use client";

import {
  Avatar,
  AvatarFallback,
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

  return (
    <TooltipProvider>
      <div className="flex -space-x-[0.6rem]">
        {visibleAvatars.map((avatar, index) => (
          <Tooltip key={`${avatar.name}-${avatar.avatarUrl}-${index}`}>
            <TooltipTrigger
              render={
                <a
                  aria-label={avatar.name}
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                  href={avatar.profileUrl || "#"}
                  rel={avatar.profileUrl ? "noreferrer" : undefined}
                  target={avatar.profileUrl ? "_blank" : undefined}
                >
                  <span className="sr-only">{avatar.name}</span>
                  <Avatar className="ring-2 ring-background">
                    {avatar.avatarUrl ? (
                      <AvatarImage alt={avatar.name} src={avatar.avatarUrl} />
                    ) : null}
                    <AvatarFallback>{getInitials(avatar.name)}</AvatarFallback>
                  </Avatar>
                </a>
              }
            />
            <TooltipPopup>{avatar.name}</TooltipPopup>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
