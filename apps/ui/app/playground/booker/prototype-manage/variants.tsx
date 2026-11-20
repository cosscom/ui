"use client";

// PROTOTYPE ONLY. Three structurally different takes on rescheduling and
// cancelling an existing booking. In all three the left pane stays the event
// information, as decided for the confirmation screen.

import { ChevronDownIcon } from "lucide-react";
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
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/default/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/registry/default/ui/dialog";
import {
  ApiRefusal,
  CompactPicker,
  canManage,
  cardClassName,
  EventPane,
  FullPicker,
  getNoun,
  mainClassName,
  ReasonField,
  ScopeChoice,
  StatusHeadline,
  type VariantProps,
} from "./parts";

function hasPicked({ flow }: VariantProps) {
  return flow.date !== undefined && flow.time !== undefined;
}

function SummaryActions({ booking, flow }: VariantProps) {
  if (flow.stage === "cancelled" || !canManage(booking)) {
    return (
      <div className="mt-auto flex justify-end border-t pt-4">
        <Button onClick={flow.startOver} variant="outline">
          Book again
        </Button>
      </div>
    );
  }
  return (
    <div className="mt-auto flex justify-end gap-2 border-t pt-4">
      <Button onClick={() => flow.setStage("cancelling")} variant="ghost">
        Cancel {getNoun(booking)}
      </Button>
      <Button onClick={() => flow.setStage("rescheduling")} variant="outline">
        Reschedule
      </Button>
    </div>
  );
}

/**
 * A. In place. Reschedule and cancel each take over the right pane, the way
 * the booking flow's own steps do. Rescheduling widens the card back to the
 * calendar and times.
 */
export function VariantA(props: VariantProps) {
  const { booking, flow } = props;

  if (flow.stage === "rescheduling") {
    return (
      <Card className={cardClassName}>
        <EventPane {...props} />
        <div className="@container flex min-w-0 flex-1 flex-col gap-5 @5xl:p-6 p-4">
          <h2 className="font-heading text-xl">Pick a new time</h2>
          <FullPicker {...props} />
          <ReasonField flow={flow} label="Reason for rescheduling" />
          <ApiRefusal message={flow.rescheduleError} />
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button onClick={() => flow.setStage("summary")} variant="ghost">
              Back
            </Button>
            <Button
              disabled={!hasPicked(props)}
              onClick={flow.submitReschedule}
            >
              Reschedule
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (flow.stage === "cancelling") {
    return (
      <Card className={cardClassName}>
        <EventPane {...props} />
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
      </Card>
    );
  }

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      <div className={`${mainClassName} flex min-h-64 flex-col gap-6`}>
        <StatusHeadline {...props} />
        <SummaryActions {...props} />
      </div>
    </Card>
  );
}

/**
 * B. Dialogs. The summary never leaves the screen. Reschedule opens a dialog
 * with the calendar; cancel opens a confirmation dialog.
 */
export function VariantB(props: VariantProps) {
  const { booking, flow } = props;
  const closeTo = (open: boolean) => {
    if (!open) {
      flow.setStage("summary");
    }
  };

  return (
    <>
      <Card className={cardClassName}>
        <EventPane {...props} />
        <div className={`${mainClassName} flex min-h-64 flex-col gap-6`}>
          <StatusHeadline {...props} />
          <SummaryActions {...props} />
        </div>
      </Card>

      <Dialog onOpenChange={closeTo} open={flow.stage === "rescheduling"}>
        <DialogPopup className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pick a new time</DialogTitle>
            <DialogDescription>
              {booking.title} with {booking.host}, {booking.duration}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="@container flex flex-col gap-5">
            <FullPicker {...props} />
            <ReasonField flow={flow} label="Reason for rescheduling" />
            <ApiRefusal message={flow.rescheduleError} />
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Back</DialogClose>
            <Button
              disabled={!hasPicked(props)}
              onClick={flow.submitReschedule}
            >
              Reschedule
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      <AlertDialog onOpenChange={closeTo} open={flow.stage === "cancelling"}>
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

/**
 * C. Inline, compact. Nothing takes over and nothing opens on top. Each
 * action unfolds under the summary, and rescheduling uses a strip of
 * upcoming days instead of a month grid.
 */
export function VariantC(props: VariantProps) {
  const { booking, flow } = props;
  const open = (stage: "rescheduling" | "cancelling") => (isOpen: boolean) =>
    flow.setStage(isOpen ? stage : "summary");
  const triggerClassName =
    "flex w-full items-center justify-between gap-2 px-3 py-2.5 font-medium text-sm data-panel-open:[&_svg]:rotate-180";
  const done = flow.stage === "cancelled" || !canManage(booking);

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      <div className={`${mainClassName} flex min-h-64 flex-col gap-6`}>
        <StatusHeadline {...props} />
        {done ? (
          <SummaryActions {...props} />
        ) : (
          <div className="flex flex-col divide-y rounded-lg border">
            <Collapsible
              onOpenChange={open("rescheduling")}
              open={flow.stage === "rescheduling"}
            >
              <CollapsibleTrigger className={triggerClassName}>
                Reschedule
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 opacity-80 transition-transform"
                />
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="flex flex-col gap-4 border-t p-3">
                  <CompactPicker {...props} />
                  <ReasonField flow={flow} label="Reason for rescheduling" />
                  <ApiRefusal message={flow.rescheduleError} />
                  <Button
                    className="self-end"
                    disabled={!hasPicked(props)}
                    onClick={flow.submitReschedule}
                  >
                    Reschedule
                  </Button>
                </div>
              </CollapsiblePanel>
            </Collapsible>
            <Collapsible
              onOpenChange={open("cancelling")}
              open={flow.stage === "cancelling"}
            >
              <CollapsibleTrigger className={triggerClassName}>
                Cancel {getNoun(booking)}
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 opacity-80 transition-transform"
                />
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="flex flex-col gap-4 border-t p-3">
                  <ScopeChoice {...props} />
                  <ReasonField
                    error={flow.cancelError}
                    flow={flow}
                    label="Reason for cancelling"
                  />
                  <Button
                    className="self-end"
                    onClick={flow.submitCancel}
                    variant="destructive"
                  >
                    Cancel {getNoun(booking)}
                  </Button>
                </div>
              </CollapsiblePanel>
            </Collapsible>
          </div>
        )}
      </div>
    </Card>
  );
}
