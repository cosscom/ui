"use client";

import { ChevronRightIcon } from "lucide-react";
import { type ComponentProps, type ReactElement, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { AgentStatusIndicator } from "@/registry/default/ui/agent-status-indicator";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/default/ui/collapsible";

export interface AgentReasoningProps
  extends ComponentProps<typeof Collapsible> {
  streamingLabel: string;
  completedLabel: string;
  isStreaming?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

export function AgentReasoning({
  children,
  className,
  streamingLabel,
  completedLabel,
  isStreaming = false,
  defaultOpen,
  triggerClassName,
  contentClassName,
  ...props
}: AgentReasoningProps): ReactElement {
  // Streaming only sets the initial default. Later updates preserve the reader's choice.
  const [initialOpen] = useState(defaultOpen ?? isStreaming);
  return (
    <Collapsible
      {...props}
      defaultOpen={initialOpen}
      className={cn("flex min-w-0 flex-col", className)}
      data-slot="agent-reasoning"
    >
      <CollapsibleTrigger
        className={cn(
          "flex pointer-coarse:min-h-11 w-fit min-w-0 max-w-full items-center gap-1.5 rounded-sm text-start text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          triggerClassName,
        )}
        data-slot="agent-reasoning-trigger"
      >
        <AgentStatusIndicator
          announce={false}
          className="text-muted-foreground"
          wrap
          label={isStreaming ? streamingLabel : completedLabel}
          status={isStreaming ? "thinking" : "idle"}
        />
        <ChevronRightIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 in-data-panel-open:rotate-90 transition-transform motion-reduce:transition-none rtl:in-data-panel-open:rotate-90 rtl:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsiblePanel
        className="motion-reduce:transition-none"
        data-slot="agent-reasoning-panel"
      >
        <div
          aria-busy={isStreaming}
          className={cn(
            "whitespace-pre-wrap ps-5 pt-2 text-muted-foreground text-xs/relaxed [overflow-wrap:anywhere]",
            contentClassName,
          )}
          data-slot="agent-reasoning-content"
        >
          {children}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}
