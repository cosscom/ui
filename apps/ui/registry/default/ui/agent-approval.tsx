"use client";

import { InfoIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useId,
} from "react";
import { cn } from "@/registry/default/lib/utils";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardPanel,
} from "@/registry/default/ui/card";

export interface AgentApprovalActionsProps
  extends Omit<ComponentProps<typeof CardFrameFooter>, "children"> {
  approveLabel: string;
  rejectLabel: string;
  disabled?: boolean;
  onRespond: (approved: boolean) => void;
}

export function AgentApproval({
  className,
  ...props
}: ComponentProps<typeof CardFrame>): ReactElement {
  return (
    <CardFrame
      className={cn("w-full min-w-0", className)}
      data-slot="agent-approval"
      {...props}
    />
  );
}

export function AgentApprovalContent({
  className,
  ...props
}: ComponentProps<typeof CardPanel>): ReactElement {
  return (
    <Card>
      <CardPanel
        className={cn(
          "flex flex-col gap-3 p-4 [overflow-wrap:anywhere]",
          className,
        )}
        data-slot="agent-approval-content"
        {...props}
      />
    </Card>
  );
}

export function AgentApprovalActions({
  approveLabel,
  rejectLabel,
  disabled = false,
  onRespond,
  className,
  ...props
}: AgentApprovalActionsProps): ReactElement {
  const respond = (approved: boolean): void => {
    if (!disabled) onRespond(approved);
  };

  return (
    <CardFrameFooter
      className={cn(
        "relative flex flex-wrap justify-end gap-2 px-3 py-2 [overflow-wrap:anywhere]",
        className,
      )}
      data-slot="agent-approval-actions"
      {...props}
    >
      <Button
        className="h-auto min-h-7 max-w-full whitespace-normal [overflow-wrap:anywhere] sm:min-h-6"
        disabled={disabled}
        onClick={(): void => respond(false)}
        size="xs"
        type="button"
        variant="ghost"
      >
        {rejectLabel}
      </Button>
      <Button
        className="h-auto min-h-7 max-w-full whitespace-normal [overflow-wrap:anywhere] sm:min-h-6"
        disabled={disabled}
        onClick={(): void => respond(true)}
        size="xs"
        type="button"
      >
        {approveLabel}
      </Button>
    </CardFrameFooter>
  );
}

export interface AgentApprovalCardProps
  extends Omit<ComponentProps<typeof AgentApproval>, "title"> {
  question: ReactNode;
  context?: ReactNode;
  details?: readonly string[];
  chip?: ReactNode;
  approveLabel: string;
  rejectLabel: string;
  disabled?: boolean;
  onRespond: (approved: boolean) => void;
}

export function AgentApprovalCard({
  question,
  context,
  details,
  chip,
  approveLabel,
  rejectLabel,
  disabled,
  onRespond,
  children,
  ...props
}: AgentApprovalCardProps): ReactElement {
  const questionId = useId();

  return (
    <AgentApproval aria-labelledby={questionId} role="group" {...props}>
      <AgentApprovalContent>
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-foreground text-sm" id={questionId}>
            {question}
          </p>
          {context && (
            <p className="flex items-start gap-1.5 text-muted-foreground text-xs">
              <span className="flex h-lh shrink-0 items-center">
                <InfoIcon aria-hidden="true" className="size-3.5" />
              </span>
              {context}
            </p>
          )}
          {details?.length ? (
            <ul className="flex list-disc flex-col gap-0.5 ps-4 text-muted-foreground text-xs">
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
        </div>
        {chip && (
          <Badge
            className="h-auto min-h-5.5 max-w-full self-start whitespace-normal sm:min-h-4.5"
            variant="secondary"
          >
            {chip}
          </Badge>
        )}
        {children}
      </AgentApprovalContent>
      <AgentApprovalActions
        approveLabel={approveLabel}
        disabled={disabled}
        onRespond={onRespond}
        rejectLabel={rejectLabel}
      />
    </AgentApproval>
  );
}

export interface AgentApprovalGroupItem {
  id: string;
  title: ReactNode;
  context?: ReactNode;
  details?: readonly string[];
  disabled?: boolean;
}

export interface AgentApprovalGroupActionsProps
  extends Omit<AgentApprovalActionsProps, "onRespond"> {
  items: readonly Pick<AgentApprovalGroupItem, "id" | "disabled">[];
  onRespond: (ids: string[], approved: boolean) => void;
}

export function AgentApprovalGroupActions({
  items,
  disabled = false,
  onRespond,
  ...props
}: AgentApprovalGroupActionsProps): ReactElement {
  const ids: string[] = [
    ...new Set(items.filter((item) => !item.disabled).map((item) => item.id)),
  ];
  const isDisabled: boolean = disabled || ids.length === 0;

  return (
    <AgentApprovalActions
      {...props}
      data-slot="agent-approval-group-actions"
      disabled={isDisabled}
      onRespond={(approved: boolean): void => {
        if (!isDisabled) onRespond([...ids], approved);
      }}
    />
  );
}

export interface AgentApprovalGroupCardProps
  extends Omit<ComponentProps<typeof AgentApproval>, "title"> {
  question: ReactNode;
  items: readonly AgentApprovalGroupItem[];
  approveLabel: string;
  rejectLabel: string;
  disabled?: boolean;
  onRespond: (ids: string[], approved: boolean) => void;
}

export function AgentApprovalGroupCard({
  question,
  items,
  approveLabel,
  rejectLabel,
  disabled,
  onRespond,
  children,
  ...props
}: AgentApprovalGroupCardProps): ReactElement | null {
  const questionId = useId();
  if (items.length === 0) return null;

  return (
    <AgentApproval
      aria-labelledby={questionId}
      data-slot="agent-approval-group"
      role="group"
      {...props}
    >
      <AgentApprovalContent className="gap-4">
        <p className="font-medium text-foreground text-sm" id={questionId}>
          {question}
        </p>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              className="flex flex-col gap-1.5"
              data-disabled={item.disabled ? "" : undefined}
              key={item.id}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="h-auto min-h-5.5 max-w-full whitespace-normal sm:min-h-4.5"
                  variant="secondary"
                >
                  {item.title}
                </Badge>
                {item.context && (
                  <span className="inline-flex items-start gap-1.5 text-muted-foreground text-xs">
                    <span className="flex h-lh shrink-0 items-center">
                      <InfoIcon aria-hidden="true" className="size-3.5" />
                    </span>
                    {item.context}
                  </span>
                )}
              </div>
              {item.details?.length ? (
                <ul className="flex list-disc flex-col gap-0.5 ps-4 text-muted-foreground text-xs">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        {children}
      </AgentApprovalContent>
      <AgentApprovalGroupActions
        approveLabel={approveLabel}
        disabled={disabled}
        items={items}
        onRespond={onRespond}
        rejectLabel={rejectLabel}
      />
    </AgentApproval>
  );
}
