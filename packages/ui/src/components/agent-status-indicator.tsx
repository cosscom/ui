import { Spinner } from "@coss/ui/components/spinner";
import { cn } from "@coss/ui/lib/utils";
import {
  CircleCheckIcon,
  CircleIcon,
  CircleXIcon,
  InfoIcon,
  type LucideIcon,
  SparklesIcon,
} from "lucide-react";
import type { ComponentProps, ReactElement } from "react";

type AgentStatus =
  | "idle"
  | "thinking"
  | "working"
  | "needs-input"
  | "complete"
  | "error";

type AgentStatusIndicatorProps = Omit<
  ComponentProps<"span">,
  "aria-busy" | "aria-label" | "aria-live" | "children" | "role"
> & {
  announce?: boolean;
  wrap?: boolean;
  label: string;
  status: AgentStatus;
};

const statusClassNames: Record<AgentStatus, string> = {
  idle: "text-muted-foreground",
  thinking: "text-muted-foreground",
  working: "text-muted-foreground",
  "needs-input": "text-warning-foreground",
  complete: "text-success-foreground",
  error: "text-destructive-foreground",
};

const statusIcons: Record<Exclude<AgentStatus, "working">, LucideIcon> = {
  idle: CircleIcon,
  thinking: SparklesIcon,
  "needs-input": InfoIcon,
  complete: CircleCheckIcon,
  error: CircleXIcon,
};

/** A presentation-only status treatment for AI agent surfaces. */
export function AgentStatusIndicator({
  announce = true,
  wrap = false,
  className,
  label,
  status,
  ...props
}: AgentStatusIndicatorProps): ReactElement {
  const isActive = status === "thinking" || status === "working";
  let statusIcon = (
    <Spinner
      aria-hidden="true"
      aria-label={undefined}
      role="presentation"
      className="size-3.5 shrink-0 motion-reduce:animate-none"
    />
  );
  if (status !== "working") {
    const Icon = statusIcons[status];
    statusIcon = <Icon aria-hidden="true" className="size-3.5 shrink-0" />;
  }

  let accessibilityProps: Pick<
    ComponentProps<"span">,
    "aria-busy" | "aria-label" | "aria-live" | "role"
  > = {};
  if (announce) {
    accessibilityProps = {
      "aria-label": label,
      "aria-live": "polite",
      role: "status",
    };
  }

  return (
    <span
      {...props}
      {...accessibilityProps}
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-xs",
        wrap && "items-start",
        statusClassNames[status],
        className,
      )}
      data-slot="agent-status-indicator"
      data-status={status}
    >
      <span className="flex h-lh shrink-0 items-center">{statusIcon}</span>
      <span
        className={cn(
          "min-w-0",
          wrap ? "whitespace-normal [overflow-wrap:anywhere]" : "truncate",
          isActive &&
            "animate-[skeleton_1.2s_-0.6s_infinite_linear] bg-clip-text text-transparent [background-image:linear-gradient(105deg,transparent_12%,--alpha(var(--color-info-foreground)/72%)_32%,--alpha(var(--color-purple-500)/76%)_50%,--alpha(var(--color-rose-500)/68%)_68%,transparent_88%),linear-gradient(var(--color-muted-foreground),var(--color-muted-foreground))] [background-size:200%_100%,100%_100%] motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-muted-foreground forced-colors:animate-none forced-colors:bg-none forced-colors:text-current",
          status === "error" && "font-medium",
        )}
        data-slot="agent-status-indicator-label"
      >
        {label}
      </span>
    </span>
  );
}

export type { AgentStatus, AgentStatusIndicatorProps };
