"use client";

import {
  CheckCheckIcon,
  CheckIcon,
  CircleAlertIcon,
  ClockIcon,
} from "lucide-react";
import type { ReactElement } from "react";
import { cn } from "@/registry/default/lib/utils";

export type ChatDeliveryIndicatorProps = {
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  label: string;
};

export function ChatDeliveryIndicator({
  status,
  label,
}: ChatDeliveryIndicatorProps): ReactElement {
  const Icon = {
    sending: ClockIcon,
    sent: CheckIcon,
    delivered: CheckCheckIcon,
    read: CheckCheckIcon,
    failed: CircleAlertIcon,
  }[status];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-slot="chat-delivery-indicator"
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-3",
          status === "read" && "text-sky-600 dark:text-sky-400",
          status === "failed" && "text-destructive",
        )}
      />
    </span>
  );
}
