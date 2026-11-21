"use client";

// PROTOTYPE ONLY. The email verification code as a step of the booking flow:
// select → form → verify → booked, every change through the Booker's own
// BookerSteps. The select step is the Booker's real calendar and time list;
// the form is the chosen form from prototype-form.

import {
  CalendarIcon,
  CircleCheckIcon,
  Clock3Icon,
  GlobeIcon,
  MailIcon,
  MailXIcon,
  VideoIcon,
} from "lucide-react";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { BookerSteps } from "@/registry/default/atoms/booker/booker-steps";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { OTPField, OTPFieldInput } from "@/registry/default/ui/otp-field";
import { FieldBlock, TermsNote } from "../prototype-form/field-block";
import {
  type FieldValue,
  type FieldValues,
  isFieldEmpty,
  simpleFields,
} from "../prototype-form/fixtures";
import {
  formatDate,
  getDaySlots,
  getNextAvailableDate,
  hasSlots,
  startOfMonth,
  today,
} from "../prototype-manage/fixtures";
import { codeLength, type Stage } from "./fixtures";
import { displayTimeLabel } from "@/lib/booker/utils";

// Why the code step opened, which changes its first sentence.
export type Reason = "eventType" | "address" | "refusedOnCreate";

// What the form shows under the email field (variant B only).
export type EmailNote = "sending" | "sent" | "notSent" | undefined;

export type Flow = {
  stage: Stage;
  month: Date;
  setMonth: (month: Date) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string | undefined;
  pickTime: (time: string) => void;
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
  values: FieldValues;
  setValue: (slug: string, value: FieldValue | undefined) => void;
  onEmailBlur: () => void;
  emailNote: EmailNote;
  // "Continue" when a code step is known to follow, else "Confirm".
  confirmLabel: string;
  confirm: () => void;
  backToSelect: () => void;
  // The code step.
  reason: Reason;
  codeSent: boolean;
  reusedCode: boolean;
  code: string;
  setCode: (code: string) => void;
  codeError: string | undefined;
  sendError: string | undefined;
  resendIn: number;
  resend: () => void;
  submitCode: (code: string) => void;
  changeEmail: () => void;
  busy: "checking" | "sending" | "booking" | undefined;
  lastResendAt: number | undefined;
};

export type StepProps = { flow: Flow };

const cardClassName =
  "@max-3xl:w-full @3xl:flex-row @5xl:[--booker-side:--spacing(70)] [--booker-side:--spacing(56)]";
const sideClassName =
  "@3xl:w-(--booker-side) @3xl:shrink-0 @3xl:border-e border-b @3xl:border-b-0";
const narrowStepClassName =
  "@3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 @5xl:p-6 p-4";
const metaIconClassName = "h-lh w-4.5 shrink-0 opacity-80 sm:w-4";
const barClassName =
  "sticky bottom-0 -mx-4 @5xl:-mx-6 -mb-4 @5xl:-mb-6 mt-auto flex items-center justify-between gap-2 rounded-b-[calc(var(--radius-2xl)-1px)] @3xl:rounded-es-none border-t bg-card @5xl:px-6 px-4 py-3";

const labels = getBookerLabels();
const codeSlots = Array.from({ length: codeLength }, (_, i) => `code-${i}`);

function getEmail(flow: Flow) {
  const email = flow.values.email;
  return typeof email === "string" ? email.trim() : "";
}

function formatCountdown(seconds: number) {
  return `0:${String(seconds).padStart(2, "0")}`;
}

function EventPane({ flow }: StepProps) {
  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted font-medium text-xs">
              RA
            </span>
            <p className="font-medium text-muted-foreground sm:text-sm">
              Rick Astley
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold font-heading @3xl:@max-5xl:text-lg text-xl">
              Product demo
            </h1>
            <p className="text-muted-foreground sm:text-sm">
              A walkthrough tailored to your team, with time for questions.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:text-sm">
          {flow.stage !== "select" && flow.date && flow.time ? (
            <div className="flex gap-2">
              <CalendarIcon aria-hidden="true" className={metaIconClassName} />
              <span>
                {formatDate(flow.date)}{" "}
                {displayTimeLabel(flow.time, !flow.is24Hour)}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Clock3Icon aria-hidden="true" className={metaIconClassName} />
            <span>{labels.durationMinutes(30)}</span>
          </div>
          <div className="flex items-center gap-2">
            <VideoIcon aria-hidden="true" className={metaIconClassName} />
            <span>Cal Video</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon aria-hidden="true" className={metaIconClassName} />
            <span>Europe/Rome</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The Booker's select step, unchanged. */
function SelectStep({ flow }: StepProps) {
  const monthStart = startOfMonth(flow.month);
  const nextMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    1,
  );
  const nextAvailableDate = getNextAvailableDate(
    flow.date && flow.date > today ? flow.date : today,
  );

  return (
    <div className="flex w-full @3xl:flex-row flex-col">
      <div className="flex @3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 flex-col items-center @3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:py-2 pt-3 pb-4">
        <BookerCalendar
          disabled={(date) => !hasSlots(date)}
          locale="en-US"
          month={flow.month}
          onMonthChange={flow.setMonth}
          onSelect={(date) => flow.setDate(date)}
          selected={flow.date}
          startMonth={startOfMonth(today)}
          today={today}
        />
      </div>
      <TimePicker
        availabilityLoading={false}
        currentMonth={flow.month}
        daySlots={getDaySlots(flow.date)}
        goToDate={(date) => {
          flow.setMonth(startOfMonth(date));
          flow.setDate(date);
        }}
        hasAvailabilityInView={Boolean(
          nextAvailableDate && nextAvailableDate < nextMonth,
        )}
        initialLoading={false}
        is24Hour={flow.is24Hour}
        labels={{
          hour12Short: labels.hour12Short,
          hour24Short: labels.hour24Short,
          noAvailableTimes: labels.noAvailableTimes,
          noSlotsAvailable: labels.noSlotsAvailable,
          noSlotsThisDay: labels.noSlotsThisDay,
          noSlotsThisMonth: labels.noSlotsThisMonth,
          use24Hour: labels.use24Hour,
          viewFirstAvailability: labels.viewFirstAvailability,
        }}
        locale="en-US"
        nextAvailableDate={nextAvailableDate}
        onIs24HourChange={flow.setIs24Hour}
        onSelectTime={flow.pickTime}
        selectedDate={flow.date}
      />
    </div>
  );
}

function EmailNoteLine({ note }: { note: EmailNote }) {
  if (!note) {
    return null;
  }
  if (note === "notSent") {
    return (
      <p className="-mt-2 text-destructive-foreground text-xs" role="alert">
        We couldn’t send a code to this address. Use a different one.
      </p>
    );
  }
  return (
    <p aria-live="polite" className="-mt-2 text-muted-foreground text-xs">
      {note === "sending"
        ? "Sending a verification code to this address…"
        : "We sent a verification code to this address. You’ll enter it next."}
    </p>
  );
}

/** The chosen form, with a note under the email field in variant B. */
function FormStep({ flow }: StepProps) {
  const left = simpleFields.filter(
    (field) => field.required && isFieldEmpty(flow.values[field.slug]),
  ).length;
  const busy = flow.busy !== undefined;

  return (
    <form
      className={`${narrowStepClassName} flex flex-col gap-4`}
      onBlurCapture={(event) => {
        // The email field: the first email input, not a guest's.
        if (
          event.target instanceof HTMLInputElement &&
          event.target.type === "email" &&
          !event.target.getAttribute("aria-label")?.startsWith("Guest")
        ) {
          flow.onEmailBlur();
        }
      }}
      onSubmit={(event) => {
        event.preventDefault();
        if (left === 0) {
          flow.confirm();
        }
      }}
    >
      {simpleFields.map((field) => (
        <div className="contents" key={field.slug}>
          <FieldBlock
            field={field}
            lockPrefilled={false}
            setValue={flow.setValue}
            showErrors={false}
            values={flow.values}
          />
          {field.kind === "email" ? (
            <EmailNoteLine note={flow.emailNote} />
          ) : null}
        </div>
      ))}
      <TermsNote />
      <div className={barClassName}>
        <span aria-live="polite" className="text-muted-foreground text-xs">
          {left === 0
            ? "Ready to confirm"
            : `${left} required ${left === 1 ? "field" : "fields"} left`}
        </span>
        <div className="flex gap-2">
          <Button onClick={flow.backToSelect} type="button" variant="ghost">
            Back
          </Button>
          <Button loading={busy} type="submit">
            {flow.confirmLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** The new step: the code that was emailed, where the form was. */
function VerifyStep({ flow }: StepProps) {
  const email = getEmail(flow);

  if (!flow.codeSent) {
    return (
      <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
        <div className="flex flex-col gap-2">
          <MailXIcon
            aria-hidden="true"
            className="size-6 text-destructive-foreground"
          />
          <h2 className="font-bold font-heading text-xl">
            We couldn’t send a code
          </h2>
          <p className="text-muted-foreground sm:text-sm">
            This booking needs a verified email address, and we couldn’t send a
            code to <span className="text-foreground">{email}</span>. Use a
            different address to book.
          </p>
        </div>
        <div className={`${barClassName} justify-end!`}>
          <Button onClick={flow.changeEmail}>Use a different email</Button>
        </div>
      </div>
    );
  }

  let intro = "To confirm the booking, enter the code we sent to";
  if (flow.reason === "refusedOnCreate") {
    intro =
      "This email address needs to be verified before the booking can be made. We sent a code to";
  } else if (flow.reusedCode) {
    intro = "Enter the code we already sent to";
  }

  const left = codeLength - flow.code.length;
  let status = left === 0 ? "Ready to confirm" : "Enter the 6-digit code";
  if (flow.busy === "booking") {
    status = "Checking the code…";
  } else if (flow.busy === "sending") {
    status = "Sending a new code…";
  }

  return (
    <form
      className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}
      onSubmit={(event) => {
        event.preventDefault();
        flow.submitCode(flow.code);
      }}
    >
      <div className="flex flex-col gap-2">
        <MailIcon aria-hidden="true" className="size-6 text-muted-foreground" />
        <h2 className="font-bold font-heading text-xl">Check your email</h2>
        <p className="text-muted-foreground sm:text-sm">
          {intro} <span className="text-foreground">{email}</span>.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <OTPField
          aria-label="Verification code"
          autoFocus
          length={codeLength}
          onValueChange={flow.setCode}
          onValueComplete={flow.submitCode}
          size="lg"
          value={flow.code}
        >
          {codeSlots.map((slot, index) => (
            <OTPFieldInput
              aria-invalid={flow.codeError ? true : undefined}
              aria-label={
                index === 0
                  ? "Verification code"
                  : `Digit ${index + 1} of ${codeLength}`
              }
              key={slot}
            />
          ))}
        </OTPField>
        {flow.codeError ? (
          <p className="text-destructive-foreground text-xs" role="alert">
            {flow.codeError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-1 text-muted-foreground sm:text-sm">
        <p>
          Didn’t get it?{" "}
          {flow.resendIn > 0 ? (
            <span>
              You can ask for a new code in {formatCountdown(flow.resendIn)}.
            </span>
          ) : (
            <Button
              className="h-auto p-0"
              onClick={flow.resend}
              type="button"
              variant="link"
            >
              Send a new code
            </Button>
          )}
        </p>
        {flow.sendError ? (
          <p className="text-destructive-foreground text-xs" role="alert">
            {flow.sendError}
          </p>
        ) : flow.lastResendAt ? (
          <p aria-live="polite" className="text-xs">
            A new email is on its way. The code may be the same as before.
          </p>
        ) : null}
        <p>
          Wrong address?{" "}
          <Button
            className="h-auto p-0"
            onClick={flow.changeEmail}
            type="button"
            variant="link"
          >
            Change it
          </Button>
        </p>
      </div>

      <div className={barClassName}>
        <span aria-live="polite" className="text-muted-foreground text-xs">
          {status}
        </span>
        <div className="flex gap-2">
          <Button onClick={flow.changeEmail} type="button" variant="ghost">
            Back
          </Button>
          <Button loading={flow.busy === "booking"} type="submit">
            Confirm
          </Button>
        </div>
      </div>
    </form>
  );
}

function BookedStep({ flow }: StepProps) {
  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-2`}>
      <CircleCheckIcon
        aria-hidden="true"
        className="size-6 text-success-foreground"
      />
      <h2 className="font-bold font-heading text-xl">You’re booked</h2>
      <p className="text-muted-foreground sm:text-sm">
        A calendar invitation was sent to {getEmail(flow)}.
      </p>
    </div>
  );
}

export function VerifyBooker(props: StepProps) {
  const step = props.flow.stage;

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      <BookerSteps step={step}>
        {step === "select" ? <SelectStep {...props} /> : null}
        {step === "form" ? <FormStep {...props} /> : null}
        {step === "verify" ? <VerifyStep {...props} /> : null}
        {step === "booked" ? <BookedStep {...props} /> : null}
      </BookerSteps>
    </Card>
  );
}
