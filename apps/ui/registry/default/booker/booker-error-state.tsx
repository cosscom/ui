import { Button } from "@/registry/default/ui/button";
import type { BookerLabels } from "./booker-labels";
import type { BookerError } from "./hooks/use-booker";
import { ResponseCard } from "./response-card";

type BookerErrorStateProps = {
  error: BookerError;
  labels: BookerLabels;
  onRetry: () => void;
};

// The Booker couldn't load: Cal Video's error card (a ResponseCard with an
// error StatusMark), with a retry when trying again can help.
export function BookerErrorState({
  error,
  labels,
  onRetry,
}: BookerErrorStateProps) {
  const isTerminal = error.kind === "not-found" || error.kind === "unpublished";
  const [title, description] =
    error.kind === "unpublished"
      ? [labels.errorUnpublished, labels.errorUnpublishedDescription]
      : error.kind === "not-found"
        ? [labels.errorNotFound, labels.errorNotFoundDescription]
        : error.kind === "network"
          ? [labels.errorNetwork, labels.errorNetworkDescription]
          : [labels.errorGeneric, labels.errorGenericDescription];

  return (
    <div
      className="flex w-full flex-1 items-center justify-center"
      role="alert"
    >
      <ResponseCard
        action={
          isTerminal ? undefined : (
            <Button onClick={onRetry} size="lg">
              {labels.retry}
            </Button>
          )
        }
        description={description}
        status="error"
        title={title}
      />
    </div>
  );
}
