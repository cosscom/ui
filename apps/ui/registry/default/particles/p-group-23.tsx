"use client";

import {
  ChevronsUpDownIcon,
  FunnelIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Badge } from "@/registry/default/ui/badge";
import { Button, buttonVariants } from "@/registry/default/ui/button";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from "@/registry/default/ui/combobox";
import { Group, GroupSeparator, GroupText } from "@/registry/default/ui/group";

type FilterOption = {
  id: string;
  label: string;
  avatar?: string;
};

const members: FilterOption[] = [
  {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
    id: "alex-chen",
    label: "Alex Chen",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
    id: "sarah-johnson",
    label: "Sarah Johnson",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
    id: "marcus-williams",
    label: "Marcus Williams",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces",
    id: "emma-davis",
    label: "Emma Davis",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces",
    id: "james-miller",
    label: "James Miller",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() ?? "";
  }
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts[parts.length - 1]?.charAt(0) ?? "";
  return (first + last).toUpperCase();
}

function MemberAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string;
  avatarUrl?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("[--avatar-size:--spacing(5)]", className)}>
      {avatarUrl ? <AvatarImage alt={name} src={avatarUrl} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

export default function Particle() {
  const [selectedMembers, setSelectedMembers] = useState<FilterOption[]>(
    members.slice(0, 2),
  );

  const renderTriggerContent = () => {
    if (selectedMembers.length === 0) return "Select";
    const firstMember = selectedMembers[0];
    const remainingCount = selectedMembers.length - 1;

    return (
      <div className="flex items-center gap-2">
        <MemberAvatar
          avatarUrl={firstMember?.avatar}
          name={firstMember?.label ?? ""}
        />
        <span className="truncate">{firstMember?.label}</span>
        {remainingCount > 0 && (
          <Badge className="tabular-nums" variant="secondary">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Group>
      <GroupText
        className={cn(
          buttonVariants({
            size: "sm",
            variant: "outline",
          }),
          "pointer-events-none",
        )}
      >
        <FunnelIcon />
        Member
      </GroupText>
      <GroupSeparator />
      <Combobox
        autoHighlight
        items={members}
        multiple
        onValueChange={(value) => {
          if (Array.isArray(value)) {
            setSelectedMembers(value);
          }
        }}
        value={selectedMembers}
      >
        <ComboboxTrigger
          render={
            <Button
              className={
                selectedMembers.length === 0 ? "justify-between" : undefined
              }
              size="sm"
              variant="outline"
            />
          }
        >
          {renderTriggerContent()}
          {selectedMembers.length === 0 && (
            <ChevronsUpDownIcon className="-me-1!" />
          )}
        </ComboboxTrigger>
        <ComboboxPopup aria-label="Select member">
          <div className="border-b p-2">
            <ComboboxInput
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
              placeholder="Search members..."
              showTrigger={false}
              startAddon={<SearchIcon />}
            />
          </div>
          <ComboboxEmpty>No members found.</ComboboxEmpty>
          <ComboboxList>
            {(option: FilterOption) => (
              <ComboboxItem key={option.id} value={option}>
                <div className="flex items-center gap-2">
                  <MemberAvatar avatarUrl={option.avatar} name={option.label} />
                  <span>{option.label}</span>
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
      <GroupSeparator />
      <Button
        aria-label="Remove filter"
        onClick={() => setSelectedMembers([])}
        size="icon-sm"
        variant="outline"
      >
        <XIcon />
      </Button>
    </Group>
  );
}
