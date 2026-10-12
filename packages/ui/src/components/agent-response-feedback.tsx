"use client";

import { AgentStatusIndicator } from "@coss/ui/components/agent-status-indicator";
import { Button } from "@coss/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@coss/ui/components/dialog";
import { Field, FieldLabel } from "@coss/ui/components/field";
import { Fieldset, FieldsetLegend } from "@coss/ui/components/fieldset";
import { Form } from "@coss/ui/components/form";
import { Textarea } from "@coss/ui/components/textarea";
import { Toggle } from "@coss/ui/components/toggle";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@coss/ui/components/tooltip";
import { cn } from "@coss/ui/lib/utils";
import {
  CheckIcon,
  PlusIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import type {
  ChangeEvent,
  ComponentProps,
  FormEvent,
  ReactElement,
} from "react";
import { useRef, useState } from "react";

export type AgentResponseFeedbackRating = "positive" | "negative";

export type AgentResponseFeedbackReason = {
  label: string;
  value: string;
};

export type AgentResponseFeedbackValue = {
  details: string;
  rating: AgentResponseFeedbackRating;
  reasons: string[];
};

export type AgentResponseFeedbackLabels = {
  badResponse: string;
  cancel: string;
  details: string;
  detailsPlaceholder: string;
  dialogDescription: string;
  dialogTitle: string;
  goodResponse: string;
  reasonPrompt: string;
  submit: string;
  submitError: string;
  thankYou: string;
};

export type AgentResponseFeedbackProps = Omit<
  ComponentProps<"div">,
  "onSubmit" | "children" | "defaultValue"
> & {
  defaultValue?: AgentResponseFeedbackRating | null;
  disabled?: boolean;
  labels: AgentResponseFeedbackLabels;
  onFeedback: (
    feedback: AgentResponseFeedbackValue | null,
  ) => Promise<void> | void;
  reasons?: AgentResponseFeedbackReason[];
  showDetails?: boolean;
  value?: AgentResponseFeedbackRating | null;
};

function getRatingAction(
  currentRating: AgentResponseFeedbackRating | null,
  nextRating: AgentResponseFeedbackRating,
): AgentResponseFeedbackValue | "open-negative-dialog" | null {
  if (currentRating === nextRating) return null;
  if (nextRating === "negative") return "open-negative-dialog";
  return { details: "", rating: "positive", reasons: [] };
}

type FeedbackDialogState = {
  details: string;
  dialogOpen: boolean;
  handleDialogOpenChange: (open: boolean) => void;
  handleDialogOpenChangeComplete: (open: boolean) => void;
  selectedReasons: string[];
  setDetails: (details: string) => void;
  toggleReason: (reason: string, pressed: boolean) => void;
};

function useFeedbackDialog(): FeedbackDialogState {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const resetDialog = (): void => {
    setDetails("");
    setSelectedReasons([]);
  };

  const handleDialogOpenChange = (open: boolean): void => setDialogOpen(open);

  const handleDialogOpenChangeComplete = (open: boolean): void => {
    if (!open) resetDialog();
  };

  const toggleReason = (reason: string, pressed: boolean): void => {
    setSelectedReasons((current) => {
      if (pressed) return [...current, reason];
      return current.filter((value) => value !== reason);
    });
  };

  return {
    details,
    dialogOpen,
    handleDialogOpenChange,
    handleDialogOpenChangeComplete,
    selectedReasons,
    setDetails,
    toggleReason,
  };
}

export function AgentResponseFeedback({
  defaultValue = null,
  disabled = false,
  labels,
  onFeedback,
  reasons = [],
  showDetails = true,
  className,
  value,
  ...props
}: AgentResponseFeedbackProps): ReactElement {
  const {
    details,
    dialogOpen,
    handleDialogOpenChange,
    handleDialogOpenChangeComplete,
    selectedReasons,
    setDetails,
    toggleReason,
  } = useFeedbackDialog();
  const [internalValue, setInternalValue] =
    useState<AgentResponseFeedbackRating | null>(defaultValue);
  const [submittingRating, setSubmittingRating] =
    useState<AgentResponseFeedbackRating | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState("");
  const negativeRef = useRef<HTMLButtonElement>(null);
  const isSubmitting = pending;
  const isSubmittingRef = useRef(false);
  let rating = internalValue;
  if (value !== undefined) rating = value;

  const submitFeedback = async (
    feedback: AgentResponseFeedbackValue | null,
  ): Promise<boolean> => {
    if (disabled || isSubmittingRef.current) return false;
    isSubmittingRef.current = true;
    setPending(true);
    setError(false);
    setNotice("");
    setSubmittingRating(feedback?.rating ?? rating);
    try {
      await onFeedback(feedback);
      if (value === undefined) setInternalValue(feedback?.rating ?? null);
      if (feedback) setNotice(labels.thankYou);
      return true;
    } catch {
      setError(true);
      return false;
    } finally {
      isSubmittingRef.current = false;
      setSubmittingRating(null);
      setPending(false);
    }
  };

  const handleRatingAction = async (
    nextRating: AgentResponseFeedbackRating,
  ): Promise<void> => {
    if (disabled || isSubmittingRef.current) return;
    const feedback = getRatingAction(rating, nextRating);
    if (feedback === "open-negative-dialog") {
      setError(false);
      handleDialogOpenChange(true);
      return;
    }
    await submitFeedback(feedback);
  };

  const handleNegativeFeedback = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (disabled || isSubmittingRef.current) return;
    const submitted = await submitFeedback({
      details: showDetails ? details.trim() : "",
      rating: "negative",
      reasons: selectedReasons,
    });
    if (!submitted) return;
    handleDialogOpenChange(false);
  };

  return (
    <TooltipProvider>
      <div
        {...props}
        className={cn("flex min-w-0 flex-col gap-2", className)}
        data-slot="agent-response-feedback"
      >
        <div
          className="flex items-center gap-0.5"
          data-slot="agent-response-feedback-actions"
        >
          <Tooltip disableHoverablePopup>
            <TooltipTrigger
              render={
                <Button
                  aria-label={labels.goodResponse}
                  aria-pressed={rating === "positive"}
                  className={cn(
                    "pointer-coarse:size-11 text-muted-foreground hover:text-foreground",
                    rating === "positive" && "bg-accent text-foreground",
                  )}
                  disabled={disabled || isSubmitting}
                  loading={submittingRating === "positive"}
                  onClick={() => void handleRatingAction("positive")}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                />
              }
            >
              <ThumbsUpIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipPopup side="bottom">{labels.goodResponse}</TooltipPopup>
          </Tooltip>

          <Tooltip disableHoverablePopup>
            <TooltipTrigger
              render={
                <Button
                  ref={negativeRef}
                  aria-label={labels.badResponse}
                  aria-pressed={rating === "negative"}
                  className={cn(
                    "pointer-coarse:size-11 text-muted-foreground hover:text-foreground",
                    rating === "negative" && "bg-accent text-foreground",
                  )}
                  disabled={disabled || isSubmitting}
                  loading={submittingRating === "negative" && !dialogOpen}
                  onClick={() => void handleRatingAction("negative")}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                />
              }
            >
              <ThumbsDownIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipPopup side="bottom">{labels.badResponse}</TooltipPopup>
          </Tooltip>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!isSubmittingRef.current) {
              setError(false);
              handleDialogOpenChange(open);
            }
          }}
          onOpenChangeComplete={handleDialogOpenChangeComplete}
        >
          <DialogPopup showCloseButton={false} finalFocus={negativeRef}>
            <DialogHeader>
              <DialogTitle>{labels.dialogTitle}</DialogTitle>
              <DialogDescription>{labels.dialogDescription}</DialogDescription>
            </DialogHeader>
            <Form
              className="contents"
              onSubmit={(event: FormEvent<HTMLFormElement>) =>
                void handleNegativeFeedback(event)
              }
            >
              <DialogPanel>
                <div className="flex flex-col gap-5">
                  {reasons.length > 0 && (
                    <Fieldset className="flex flex-col gap-2">
                      <FieldsetLegend className="font-medium text-sm">
                        {labels.reasonPrompt}
                      </FieldsetLegend>
                      <div className="flex flex-wrap gap-2">
                        {reasons.map((reason) => {
                          const selected = selectedReasons.includes(
                            reason.value,
                          );
                          let icon = <PlusIcon aria-hidden="true" />;
                          if (selected) icon = <CheckIcon aria-hidden="true" />;
                          return (
                            <Toggle
                              key={reason.value}
                              className="h-auto min-h-8 max-w-full gap-1.5 whitespace-normal py-1 sm:min-h-7"
                              disabled={disabled || isSubmitting}
                              onPressedChange={(pressed: boolean) =>
                                toggleReason(reason.value, pressed)
                              }
                              pressed={selected}
                              size="sm"
                              type="button"
                              variant="outline"
                            >
                              {icon}
                              <span className="min-w-0 [overflow-wrap:anywhere]">
                                {reason.label}
                              </span>
                            </Toggle>
                          );
                        })}
                      </div>
                    </Fieldset>
                  )}
                  {showDetails && (
                    <Field>
                      <FieldLabel>{labels.details}</FieldLabel>
                      <Textarea
                        disabled={disabled || isSubmitting}
                        name="feedback-details"
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                          setDetails(event.target.value)
                        }
                        placeholder={labels.detailsPlaceholder}
                        value={details}
                      />
                    </Field>
                  )}
                  {error && (
                    <div className="w-full" role="alert">
                      <AgentStatusIndicator
                        announce={false}
                        status="error"
                        label={labels.submitError}
                        className="max-w-full"
                        wrap
                      />
                    </div>
                  )}
                </div>
              </DialogPanel>
              <DialogFooter>
                <DialogClose
                  disabled={disabled || isSubmitting}
                  render={
                    <Button
                      className="h-auto min-h-9 whitespace-normal [overflow-wrap:anywhere] sm:min-h-8"
                      type="button"
                      variant="ghost"
                    />
                  }
                >
                  {labels.cancel}
                </DialogClose>
                <Button
                  disabled={disabled || isSubmitting}
                  loading={isSubmitting}
                  className="h-auto min-h-9 whitespace-normal [overflow-wrap:anywhere] sm:min-h-8"
                  type="submit"
                >
                  {labels.submit}
                </Button>
              </DialogFooter>
            </Form>
          </DialogPopup>
        </Dialog>
        {error && !dialogOpen && (
          <div className="w-full" role="alert">
            <AgentStatusIndicator
              announce={false}
              status="error"
              label={labels.submitError}
              className="max-w-full"
              wrap
            />
          </div>
        )}
        <span className="sr-only" role="status">
          {notice}
        </span>
      </div>
    </TooltipProvider>
  );
}
