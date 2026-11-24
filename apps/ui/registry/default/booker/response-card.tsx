// A copy of Cal's shared ResponseCard
// (calcom/cal `packages/coss-ui/src/shared/response-card.tsx`), the card Cal
// Video shows for its errors. Only the import paths differ.

import type React from "react";
import { cn } from "@/registry/default/lib/utils";
import {
  Card,
  CardDescription,
  CardFrame,
  CardFrameFooter,
  CardPanel,
  CardTitle,
} from "@/registry/default/ui/card";
import { StatusMark, type StatusMarkStatus } from "./status-mark";

export type ResponseCardProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: StatusMarkStatus;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  titleProps?: {
    id?: string;
    "data-testid"?: string;
  };
  "data-testid"?: string;
};

export function ResponseCard({
  title,
  description,
  status,
  icon,
  children,
  action,
  footer,
  className,
  titleProps,
  "data-testid": dataTestId,
}: ResponseCardProps): React.ReactElement {
  const hasFooter = footer !== undefined && footer !== null && footer !== false;
  const card = (
    <Card
      className={cn(!hasFooter && "w-full max-w-md", !hasFooter && className)}
      data-testid={hasFooter ? undefined : dataTestId}
    >
      <CardPanel className="py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <StatusMark status={status} icon={icon} />
            <div className="flex flex-col items-center gap-2">
              <CardTitle
                className="font-bold font-heading text-xl leading-none"
                // biome-ignore lint/a11y/useHeadingContent: CardTitle renders the title into it
                render={<h1 />}
                {...titleProps}
              >
                {title}
              </CardTitle>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </div>
          </div>
          {children !== undefined && children !== null ? (
            <div className="flex w-full flex-col items-center gap-3">
              {children}
            </div>
          ) : null}
          {action}
        </div>
      </CardPanel>
    </Card>
  );

  if (!hasFooter) {
    return card;
  }

  return (
    <CardFrame
      className={cn("w-full max-w-md", className)}
      data-testid={dataTestId}
    >
      {card}
      <CardFrameFooter>{footer}</CardFrameFooter>
    </CardFrame>
  );
}
