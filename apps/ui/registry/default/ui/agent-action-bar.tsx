"use client";

import { SendIcon } from "lucide-react";
import type { ComponentProps, ReactElement } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Toolbar, ToolbarButton } from "@/registry/default/ui/toolbar";

export interface AgentActionBarProps extends ComponentProps<typeof Toolbar> {
  "aria-label": string;
}

export function AgentActionBar({
  className,
  ...props
}: AgentActionBarProps): ReactElement {
  return (
    <Toolbar
      {...props}
      className={cn(
        "max-w-full items-center justify-end gap-1 rounded-none border-0 bg-transparent p-0 shadow-none",
        className,
      )}
      data-slot="agent-action-bar"
    />
  );
}

export type AgentActionBarLauncherProps = Omit<
  ComponentProps<typeof ToolbarButton>,
  "render" | "nativeButton"
>;

export function AgentActionBarLauncher({
  children,
  className,
  ...props
}: AgentActionBarLauncherProps): ReactElement {
  return (
    <ToolbarButton
      {...props}
      className={cn(
        "pointer-coarse:min-h-11 gap-1.5 text-muted-foreground hover:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground",
        className,
      )}
      data-slot="agent-action-bar-launcher"
      render={<Button size="xs" type="button" variant="ghost" />}
    >
      <SendIcon aria-hidden="true" />
      {children}
    </ToolbarButton>
  );
}
