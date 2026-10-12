"use client";

import { Button } from "@coss/ui/components/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@coss/ui/components/tooltip";
import { cn } from "@coss/ui/lib/utils";
import { Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";

type AgentPanelLabels = {
  close: string;
  minimize: string;
  openFullPage: string;
};

type AgentPanelProps = Omit<ComponentProps<"section">, "title"> & {
  children?: ReactNode;
  className?: string;
  composer?: ReactNode;
  labels: AgentPanelLabels;
  onClose: () => void;
  onMinimize: () => void;
  onOpenFullPage?: () => void;
  openFullPageHref?: string;
  title: string;
  titleActions?: ReactNode;
};

function AgentPanelIconAction({
  children,
  href,
  label,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  label: string;
  onClick?: () => void;
}): ReactElement {
  const className =
    "pointer-coarse:size-11 text-muted-foreground hover:text-foreground";
  let trigger: ReactElement = (
    <Button
      aria-label={label}
      disabled={onClick == null}
      className={className}
      onClick={onClick}
      size="icon-xs"
      type="button"
      variant="ghost"
    />
  );
  if (href != null) {
    trigger = (
      <Button
        aria-label={label}
        className={className}
        render={
          <a aria-label={label} href={href}>
            {children}
          </a>
        }
        size="icon-xs"
        variant="ghost"
      />
    );
  }

  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger render={trigger}>{children}</TooltipTrigger>
      <TooltipPopup side="bottom">{label}</TooltipPopup>
    </Tooltip>
  );
}

function AgentPanel({
  children,
  className,
  composer,
  labels,
  onClose,
  onMinimize,
  onOpenFullPage,
  openFullPageHref,
  title,
  titleActions,
  ...props
}: AgentPanelProps): ReactElement {
  let footer: ReactNode;
  if (composer != null) {
    footer = (
      <div className="shrink-0 px-3 pb-3" data-slot="agent-panel-composer">
        {composer}
      </div>
    );
  }

  return (
    <section
      {...props}
      aria-label={title}
      className={cn("flex min-h-0 min-w-0 flex-col", className)}
      data-slot="agent-panel"
    >
      <header
        data-slot="agent-panel-header"
        className="flex shrink-0 items-center gap-2 px-3 py-2"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <h2 className="min-w-0 truncate font-medium text-sm">{title}</h2>
          {titleActions}
        </div>
        <TooltipProvider>
          <div className="flex shrink-0 items-center">
            {(openFullPageHref != null || onOpenFullPage != null) && (
              <AgentPanelIconAction
                href={openFullPageHref}
                label={labels.openFullPage}
                onClick={onOpenFullPage}
              >
                <Maximize2Icon aria-hidden="true" />
              </AgentPanelIconAction>
            )}
            <AgentPanelIconAction label={labels.minimize} onClick={onMinimize}>
              <MinusIcon aria-hidden="true" />
            </AgentPanelIconAction>
            <AgentPanelIconAction label={labels.close} onClick={onClose}>
              <XIcon aria-hidden="true" />
            </AgentPanelIconAction>
          </div>
        </TooltipProvider>
      </header>
      <div
        data-slot="agent-panel-content"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        {children}
      </div>
      {footer}
    </section>
  );
}

export { AgentPanel };
export type { AgentPanelLabels, AgentPanelProps };
