"use client";

import {
  Tabs as CossTabs,
  TabsList as CossTabsList,
  TabsPanel as CossTabsPanel,
  TabsTab as CossTabsTab,
} from "@coss/ui/components/tabs";
import { cn } from "@coss/ui/lib/utils";
import type { ComponentProps } from "react";

export function Tabs({ className, ...props }: ComponentProps<typeof CossTabs>) {
  return <CossTabs className={cn("gap-0", className)} {...props} />;
}

export function TabsList({
  className,
  ...props
}: Omit<ComponentProps<typeof CossTabsList>, "variant">) {
  return (
    <CossTabsList
      className={cn(
        "w-full justify-start border-b px-4 py-2 [&_[data-slot=tab-indicator]]:bg-[var(--accura-brand-950-darkshade)]",
        className,
      )}
      variant="underline"
      {...props}
    />
  );
}

export function TabsTab({
  className,
  ...props
}: ComponentProps<typeof CossTabsTab>) {
  return (
    <CossTabsTab
      className={cn(
        "h-10 grow-0 px-3 text-muted-foreground hover:bg-transparent! hover:text-[var(--accura-brand-950-darkshade)] data-active:text-[var(--accura-brand-950-darkshade)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({
  className,
  ...props
}: ComponentProps<typeof CossTabsPanel>) {
  return <CossTabsPanel className={className} {...props} />;
}
