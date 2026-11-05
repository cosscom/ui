import { Alert, AlertDescription, AlertTitle } from "@coss/ui/components/alert";
import { cn } from "@coss/ui/lib/utils";
import { InfoCircle } from "iconoir-react";
import { type ComponentType, type ReactNode, useId } from "react";

type InformationIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  className?: string;
}>;

type AccuraInformationPanelProps = {
  children: ReactNode;
  className?: string;
  icon?: InformationIcon;
  title: ReactNode;
};

export function AccuraInformationPanel({
  children,
  className,
  icon: Icon = InfoCircle,
  title,
}: AccuraInformationPanelProps) {
  const titleId = useId();

  return (
    <Alert
      aria-labelledby={titleId}
      className={cn("[&_[data-slot=alert-title]]:text-info", className)}
      role="note"
      variant="info"
    >
      <Icon aria-hidden="true" />
      <AlertTitle id={titleId}>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
