"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { Skeleton } from "@/registry/default/ui/skeleton";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { type BookerAvatar, getInitials } from "@/lib/booker/utils";

const maxVisibleAvatars = 4;

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

  // As the design system's HostAvatars: at most four avatars, then a count
  // that lists the rest. Each avatar is the link itself, so AvatarGroup's
  // overlap and cut-outs apply to it directly.
  const shownAvatars = visibleAvatars.slice(0, maxVisibleAvatars);
  const hiddenAvatars = visibleAvatars.slice(maxVisibleAvatars);
  const hiddenLabel =
    hiddenAvatars.length === 1
      ? "1 more host"
      : `${hiddenAvatars.length} more hosts`;

  return (
    <TooltipProvider delay={0}>
      <AvatarGroup topmost="last">
        {shownAvatars.map((avatar, index) => (
          <Tooltip key={`${avatar.name}-${avatar.avatarUrl}-${index}`}>
            <TooltipTrigger
              render={
                <Avatar
                  aria-label={avatar.name}
                  className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card"
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
        {hiddenAvatars.length > 0 ? (
          <Popover>
            <PopoverTrigger
              aria-label={hiddenLabel}
              className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card"
              delay={0}
              nativeButton={false}
              openOnHover
              render={<AvatarGroupCount />}
            >
              +{hiddenAvatars.length}
            </PopoverTrigger>
            <PopoverPopup
              align="start"
              aria-label="Additional hosts"
              side="top"
              tooltipStyle
            >
              <ul className="flex flex-col gap-1">
                {hiddenAvatars.map((avatar, index) => (
                  <li
                    className="font-medium text-xs"
                    key={`${avatar.name}-${index}`}
                  >
                    {avatar.name}
                  </li>
                ))}
              </ul>
            </PopoverPopup>
          </Popover>
        ) : null}
      </AvatarGroup>
    </TooltipProvider>
  );
}
