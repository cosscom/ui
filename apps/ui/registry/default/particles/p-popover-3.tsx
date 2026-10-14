"use client";

import { BellIcon, UserIcon } from "lucide-react";
import type { ComponentType } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverCreateHandle,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const popoverHandle = PopoverCreateHandle<ComponentType>();

const NotificationsContent = () => {
  return (
    <>
      <PopoverTitle className="text-base">Notifications</PopoverTitle>
      <PopoverDescription>
        You have no new notifications at this time.
      </PopoverDescription>
    </>
  );
};

const ProfileContent = () => {
  return (
    <div className="w-48">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            alt="Mark Andersson"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
          />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-1 font-medium text-sm">Mark Andersson</h4>
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            Product Designer
          </div>
        </div>
      </div>
      <Button className="mt-3 w-full" size="sm" variant="outline">
        Log out
      </Button>
    </div>
  );
};

export default function Particle() {
  return (
    <div className="flex gap-2">
      <PopoverTrigger
        handle={popoverHandle}
        payload={NotificationsContent}
        render={
          <Button aria-label="Notifications" size="icon" variant="outline" />
        }
      >
        <BellIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverTrigger
        handle={popoverHandle}
        payload={ProfileContent}
        render={<Button aria-label="Profile" size="icon" variant="outline" />}
      >
        <UserIcon aria-hidden="true" />
      </PopoverTrigger>
      <Popover handle={popoverHandle}>
        {({ payload: Payload }) => (
          <PopoverPopup
            aria-label={
              Payload === ProfileContent ? "Profile" : "Notifications"
            }
            className="min-w-none"
          >
            {Payload !== undefined && <Payload />}
          </PopoverPopup>
        )}
      </Popover>
    </div>
  );
}
