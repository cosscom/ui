"use client";

import { Button } from "@coss/ui/components/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from "@coss/ui/components/command";
import { Kbd, KbdGroup } from "@coss/ui/components/kbd";
import {
  ArrowTurnBackwardIcon,
  BookOpen02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { ComponentProps } from "react";
import * as React from "react";
import { useIsMac } from "@/hooks/use-is-mac";
import type { source } from "@/lib/source";

interface PageItem {
  value: string;
  label: string;
  url: string;
  keywords?: string[];
}

interface PageGroup {
  value: string;
  items: PageItem[];
}

// The docs' search, as on coss.com/ui: ⌘K (or /) opens it, every page of
// the docs by its section, and the header's links on top.
export function CommandMenu({
  tree,
  navItems,
  ...props
}: ComponentProps<typeof CommandDialog> & {
  tree: typeof source.pageTree;
  navItems?: { href: string; label: string }[];
}) {
  const isMac = useIsMac();
  const [open, setOpen] = React.useState(false);

  const groupedItems = React.useMemo<PageGroup[]>(() => {
    const groups: PageGroup[] = [];

    if (navItems && navItems.length > 0) {
      groups.push({
        items: navItems.map((item) => ({
          keywords: ["nav", "navigation", item.label.toLowerCase()],
          label: item.label,
          url: item.href,
          value: `Navigation ${item.label}`,
        })),
        value: "Pages",
      });
    }

    for (const group of tree.children) {
      if (group.type !== "folder") continue;
      const items: PageItem[] = [];
      for (const item of group.children) {
        if (item.type !== "page") continue;
        const itemName = item.name?.toString() || "";
        items.push({
          label: itemName,
          url: item.url,
          value: itemName ? `${group.name} ${itemName}` : "",
        });
      }
      if (items.length > 0) {
        groups.push({
          items,
          value:
            typeof group.name === "string" ? group.name : String(group.name),
        });
      }
    }

    return groups;
  }, [tree, navItems]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog onOpenChange={setOpen} open={open} {...props}>
      <CommandDialogTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        <KbdGroup className="gap-1">
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd className="aspect-square">K</Kbd>
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command items={groupedItems}>
          <CommandInput placeholder="Search the docs…" />
          <CommandPanel>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {(group: PageGroup) => (
                <CommandGroup items={group.items} key={group.value}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <CommandCollection>
                    {(item: PageItem) => (
                      <CommandItem
                        className="flex w-full items-center"
                        key={item.value}
                        render={
                          <Link
                            href={item.url}
                            onNavigate={() => setOpen(false)}
                          />
                        }
                      >
                        <HugeiconsIcon
                          className="mr-2 h-4 w-4 opacity-80"
                          icon={BookOpen02Icon}
                          strokeWidth={2}
                        />
                        <span className="flex-1">{item.label}</span>
                      </CommandItem>
                    )}
                  </CommandCollection>
                </CommandGroup>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">Go to Page</span>
              <Kbd>
                <HugeiconsIcon icon={ArrowTurnBackwardIcon} strokeWidth={2} />
              </Kbd>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
