"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/registry/default/ui/combobox";

type TeamMember = {
  avatar: string;
  initials: string;
  label: string;
  priority: "Lowest" | "Low" | "Medium" | "High" | "Highest";
  value: string;
  weight: number;
};

const teamMembers: TeamMember[] = [
  {
    avatar:
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80",
    initials: "JH",
    label: "Jenny Hamilton",
    priority: "Highest",
    value: "jenny",
    weight: 200,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=72&h=72&dpr=2&q=80",
    initials: "PS",
    label: "Paul Smith",
    priority: "Medium",
    value: "paul",
    weight: 100,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=72&h=72&dpr=2&q=80",
    initials: "LW",
    label: "Luna Wyen",
    priority: "High",
    value: "luna",
    weight: 150,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&dpr=2&q=80",
    initials: "AC",
    label: "Alex Chen",
    priority: "Low",
    value: "alex",
    weight: 100,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&dpr=2&q=80",
    initials: "SJ",
    label: "Sarah Johnson",
    priority: "Medium",
    value: "sarah",
    weight: 50,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=72&h=72&dpr=2&q=80",
    initials: "ED",
    label: "Emma Davis",
    priority: "Lowest",
    value: "emma",
    weight: 100,
  },
];

export default function Particle() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TeamMember[]>(
    teamMembers.slice(0, 2),
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <Combobox
        autoHighlight
        items={teamMembers}
        multiple
        onOpenChange={setOpen}
        onValueChange={(value) => {
          setSelected(value);
          setOpen(false);
        }}
        open={open}
        value={selected}
      >
        <ComboboxInput
          aria-label="Add team members"
          placeholder="Add team members…"
          startAddon={<SearchIcon />}
        />
        <ComboboxPopup>
          <ComboboxEmpty>No team members found.</ComboboxEmpty>
          <ComboboxList>
            {(item: TeamMember) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
      {selected.length > 0 && (
        <ul className="flex flex-col gap-2">
          {selected.map((member) => (
            <li
              className="flex items-center gap-2 rounded-lg border border-input p-1 ps-2 text-base sm:text-sm"
              key={member.value}
            >
              <Avatar className="[--avatar-size:--spacing(5)]">
                <AvatarImage alt={member.label} src={member.avatar} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{member.label}</span>
              <Badge className="ms-auto" variant="outline">
                {member.priority}
              </Badge>
              <span className="text-muted-foreground tabular-nums">
                {member.weight}%
              </span>
              <Button
                aria-label={`Remove ${member.label}`}
                onClick={() =>
                  setSelected((current) =>
                    current.filter((item) => item.value !== member.value),
                  )
                }
                size="icon-xs"
                variant="ghost"
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
