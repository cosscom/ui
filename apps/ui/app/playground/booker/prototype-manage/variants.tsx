"use client";

// PROTOTYPE ONLY. Rescheduling uses the Booker's own select step in both
// variants. They differ only in where cancelling happens. In both, the left
// pane stays the event information.

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/registry/default/ui/alert-dialog";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import {
  canManage,
  cardClassName,
  EventPane,
  getNoun,
  mainClassName,
  ReasonField,
  RescheduleConfirm,
  RescheduleSelect,
  ScopeChoice,
  StatusHeadline,
  type VariantProps,
} from "./parts";

function SummaryPane(props: VariantProps) {
  const { booking, flow } = props;
  const done = flow.stage === "cancelled" || !canManage(booking);

  return (
    <div className={`${mainClassName} flex min-h-64 flex-col gap-6`}>
      <StatusHeadline {...props} />
      {done ? (
        <div className="mt-auto flex justify-end border-t pt-4">
          <Button onClick={flow.startOver} variant="outline">
            Book again
          </Button>
        </div>
      ) : (
        <div className="mt-auto flex justify-end gap-2 border-t pt-4">
          <Button onClick={() => flow.setStage("cancelling")} variant="ghost">
            Cancel {getNoun(booking)}
          </Button>
          <Button onClick={flow.startReschedule} variant="outline">
            Reschedule
          </Button>
        </div>
      )}
    </div>
  );
}

/** The right-hand side of the card for the reschedule path and the summary. */
function SharedRightSide(props: VariantProps) {
  const { flow } = props;
  if (flow.stage === "rescheduling") {
    return <RescheduleSelect {...props} />;
  }
  if (flow.stage === "confirmingReschedule") {
    return <RescheduleConfirm {...props} />;
  }
  return <SummaryPane {...props} />;
}

/** A. Cancelling takes over the right pane, like a step of the flow. */
export function VariantA(props: VariantProps) {
  const { booking, flow } = props;

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      {flow.stage === "cancelling" ? (
        <div className={`${mainClassName} flex flex-col gap-5`}>
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-xl">
              Cancel this {getNoun(booking)}?
            </h2>
            <p className="text-muted-foreground sm:text-sm">
              {booking.host} will be told.
            </p>
          </div>
          <ScopeChoice {...props} />
          <ReasonField
            error={flow.cancelError}
            flow={flow}
            label="Reason for cancelling"
          />
          <div className="mt-auto flex justify-end gap-2 border-t pt-4">
            <Button onClick={() => flow.setStage("summary")} variant="ghost">
              Keep {getNoun(booking)}
            </Button>
            <Button onClick={flow.submitCancel} variant="destructive">
              Cancel {getNoun(booking)}
            </Button>
          </div>
        </div>
      ) : (
        <SharedRightSide {...props} />
      )}
    </Card>
  );
}

/** B. Cancelling opens a confirmation dialog over the summary. */
export function VariantB(props: VariantProps) {
  const { booking, flow } = props;

  return (
    <>
      <Card className={cardClassName}>
        <EventPane {...props} />
        <SharedRightSide {...props} />
      </Card>

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            flow.setStage("summary");
          }
        }}
        open={flow.stage === "cancelling"}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this {getNoun(booking)}?</AlertDialogTitle>
            <AlertDialogDescription>
              {booking.host} will be told.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4 px-6 pb-4">
            <ScopeChoice {...props} />
            <ReasonField
              error={flow.cancelError}
              flow={flow}
              label="Reason for cancelling"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              Keep {getNoun(booking)}
            </AlertDialogClose>
            <Button onClick={flow.submitCancel} variant="destructive">
              Cancel {getNoun(booking)}
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}
