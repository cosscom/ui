import {
  AlertCircleIcon,
  EyeOffIcon,
  RefreshCwIcon,
  SearchXIcon,
} from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/registry/default/ui/empty";
import type { BookerLabels } from "./booker-labels";
import type { BookerError } from "@/lib/booker/use-booker";

type BookerErrorStateProps = {
  error: BookerError;
  labels: BookerLabels;
  onRetry: () => void;
};

export function BookerErrorState({
  error,
  labels,
  onRetry,
}: BookerErrorStateProps) {
  const isTerminal = error.kind === "not-found" || error.kind === "unpublished";
  const Icon =
    error.kind === "unpublished"
      ? EyeOffIcon
      : error.kind === "not-found"
        ? SearchXIcon
        : AlertCircleIcon;
  const heading =
    error.kind === "unpublished"
      ? labels.errorUnpublished
      : error.kind === "not-found"
        ? labels.errorNotFound
        : error.kind === "network"
          ? labels.errorNetwork
          : labels.errorGeneric;

  return (
    <div
      className="@container mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4"
      role="alert"
    >
      <Card className="w-full">
        <Empty className="gap-4 py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="mb-1">
              <Icon aria-hidden="true" />
            </EmptyMedia>
            <EmptyDescription>{heading}</EmptyDescription>
          </EmptyHeader>
          {!isTerminal && (
            <EmptyContent>
              <Button variant="outline" onClick={onRetry}>
                <RefreshCwIcon aria-hidden="true" />
                {labels.retry}
              </Button>
            </EmptyContent>
          )}
        </Empty>
      </Card>
    </div>
  );
}
