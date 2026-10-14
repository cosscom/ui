"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const users = [
  {
    avatar:
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80",
    initials: "JH",
    label: "Jenny Hamilton",
    username: "@jennycodes",
    value: "jenny",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=72&h=72&dpr=2&q=80",
    initials: "PS",
    label: "Paul Smith",
    username: "@paulsmith",
    value: "paul",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=72&h=72&dpr=2&q=80",
    initials: "LW",
    label: "Luna Wyen",
    username: "@wyen.luna",
    value: "luna",
  },
];

export default function Particle() {
  return (
    <Select defaultValue={users[0]} itemToStringValue={(item) => item.value}>
      <SelectTrigger aria-label="Select user" className="h-auto py-1.5">
        <SelectValue>
          {(item) => (
            <span className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage alt={item.label} src={item.avatar} />
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <span className="flex flex-col text-left">
                <span className="truncate font-medium">{item.label}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {item.username}
                </span>
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {users.map((item) => (
          <SelectItem className="py-1.5" key={item.value} value={item}>
            <span className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage alt={item.label} src={item.avatar} />
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <span className="flex flex-col">
                <span className="truncate font-medium">{item.label}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {item.username}
                </span>
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
