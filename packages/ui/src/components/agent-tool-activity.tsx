"use client";

import {
  type AgentStatus,
  AgentStatusIndicator,
} from "@coss/ui/components/agent-status-indicator";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@coss/ui/components/collapsible";
import { cn } from "@coss/ui/lib/utils";
import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";

export interface AgentToolActivityGroupProps
  extends ComponentProps<typeof Collapsible> {
  summary: string;
  status: AgentStatus;
  triggerClassName?: string;
  contentClassName?: string;
}

export function AgentToolActivityGroup({
  children,
  className,
  summary,
  status,
  triggerClassName,
  contentClassName,
  ...props
}: AgentToolActivityGroupProps): ReactElement {
  return (
    <Collapsible
      {...props}
      className={cn("min-w-0", className)}
      data-slot="agent-tool-activity-group"
    >
      <CollapsibleTrigger
        className={cn(
          "flex pointer-coarse:min-h-11 w-fit min-w-0 max-w-full items-center gap-1.5 rounded-sm text-start text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          triggerClassName,
        )}
        data-slot="agent-tool-activity-trigger"
      >
        <AgentStatusIndicator
          announce={false}
          className="text-muted-foreground"
          wrap
          label={summary}
          status={status}
        />
        <ChevronRightIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 in-data-panel-open:rotate-90 transition-transform motion-reduce:transition-none rtl:in-data-panel-open:rotate-90 rtl:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsiblePanel
        className="motion-reduce:transition-none"
        data-slot="agent-tool-activity-panel"
      >
        <div
          className={cn("flex flex-col gap-1.5 ps-5 pt-1.5", contentClassName)}
        >
          {children}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}

export interface AgentToolActivityRowProps extends ComponentProps<"div"> {
  icon?: ReactNode;
}

export function AgentToolActivityRow({
  children,
  className,
  icon = <SparklesIcon />,
  ...props
}: AgentToolActivityRowProps): ReactElement {
  return (
    <div
      {...props}
      className={cn("flex min-w-0 gap-1.5 text-foreground text-xs", className)}
      data-slot="agent-tool-activity-row"
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className="flex h-lh shrink-0 items-center text-muted-foreground [&_svg]:size-3.5"
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 [overflow-wrap:anywhere]">{children}</div>
    </div>
  );
}
