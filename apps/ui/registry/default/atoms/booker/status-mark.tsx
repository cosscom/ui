// A copy of Cal's shared StatusMark
// (calcom/cal `packages/coss-ui/src/shared/status-mark.tsx`), used by the
// design system's time list error. Only the import paths differ.

import {
  CheckIcon,
  InfoIcon,
  MinusIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import type React from "react";
import { cn } from "@/registry/default/lib/utils";

export type StatusMarkStatus =
  | "default"
  | "error"
  | "info"
  | "success"
  | "warning";

export type StatusMarkVariant = "soft" | "surface";

export type StatusMarkProps = {
  status?: StatusMarkStatus;
  variant?: StatusMarkVariant;
  icon?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

const STATUS_ICON = {
  default: MinusIcon,
  error: XIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: TriangleAlertIcon,
} as const;

const STATUS_ICON_TONE: Record<StatusMarkStatus, string> = {
  default: "text-neutral-600 dark:text-neutral-400",
  error: "text-red-600 dark:text-red-500",
  info: "text-blue-600 dark:text-blue-500",
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-amber-600 dark:text-amber-500",
};

const SOFT_CIRCLE: Record<StatusMarkStatus, string> = {
  default: "bg-muted",
  error: "border-destructive/32 bg-destructive/4",
  info: "border-info/32 bg-info/4",
  success: "border-success/32 bg-success/4",
  warning: "border-warning/32 bg-warning/4",
};

const SURFACE_CIRCLE =
  "bg-[color-mix(in_srgb,var(--popover)_94%,var(--color-white))] not-dark:bg-clip-padding shadow-xs/5";

export function StatusMark({
  status = "default",
  variant = "soft",
  icon,
  className,
  "data-testid": dataTestId,
}: StatusMarkProps): React.ReactElement {
  const StatusIcon = STATUS_ICON[status];
  const renderedIcon = icon ?? <StatusIcon aria-hidden="true" />;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex size-12 items-center justify-center rounded-full border [&>svg]:size-6",
        STATUS_ICON_TONE[status],
        variant === "surface" ? SURFACE_CIRCLE : SOFT_CIRCLE[status],
        className,
      )}
      data-testid={dataTestId}
    >
      {renderedIcon}
    </div>
  );
}
