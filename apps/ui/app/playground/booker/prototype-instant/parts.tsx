"use client";

// PROTOTYPE ONLY. An instant meeting as a route through the Booker's steps:
// select → form → waiting → joined, or → ended with "Schedule a time
// instead". Every change goes through BookerSteps. The select step is the
// Booker's real calendar and time list; the form is the chosen form.

import {
  CalendarIcon,
  CircleCheckIcon,
  Clock3Icon,
  GlobeIcon,
  HourglassIcon,
  PhoneOffIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { BookerAvatars } from "@/registry/default/atoms/booker/booker-avatars";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { BookerSteps } from "@/registry/default/atoms/booker/booker-steps";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
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
import type { EndReason, Stage, VariantKey } from "./fixtures";
import { displayTimeLabel } from "@/lib/booker/utils";

export type Mode = "scheduled" | "instant";

export type Flow = {
  variant: VariantKey;
  stage: Stage;
  mode: Mode;
  offerInstant: boolean;
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
  meetNow: () => void;
  submit: () => void;
  backToSelect: () => void;
  busy: boolean;
  secondsLeft: number;
  stopWaiting: () => void;
  endReason: EndReason;
  scheduleInstead: () => void;
  host: string | undefined;
  videoLink: string;
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
// The team's hosts until one accepts; then only that host.
const team = ["Rick Astley", "Jane Doe", "Mia Kato"].map((name) => ({
  avatarUrl: "",
  name,
  profileUrl: "",
}));

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function getEmail(flow: Flow) {
  const email = flow.values.email;
  return typeof email === "string" ? email.trim() : "";
}

/** The "meet now" offer. Variant A puts it in the event pane. */
function MeetNowInPane({ flow }: StepProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border p-3">
      <div className="flex flex-col gap-1">
        <p className="font-medium sm:text-sm">Can’t wait?</p>
        <p className="text-muted-foreground sm:text-sm">
          Ask to meet now. Someone from the team can join in a minute or two.
        </p>
      </div>
      <Button onClick={flow.meetNow} size="sm" variant="outline">
        <ZapIcon aria-hidden="true" />
        Meet now
      </Button>
    </div>
  );
}

/** Variant B puts it in a row above the calendar and the time list. */
function MeetNowAboveCalendar({ flow }: StepProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b @5xl:px-6 px-4 py-3">
      <p className="text-muted-foreground sm:text-sm">
        <span className="font-medium text-foreground">Can’t wait?</span> Someone
        from the team can join in a minute or two.
      </p>
      <Button onClick={flow.meetNow} size="sm" variant="outline">
        <ZapIcon aria-hidden="true" />
        Meet now
      </Button>
    </div>
  );
}

/**
 * Variant C puts it in a bar along the bottom of the whole card, like Cal's
 * floating "Connect now" bar, but kept inside the card.
 */
function MeetNowBar({ flow }: StepProps) {
  return (
    <div className="flex basis-full flex-wrap items-center justify-between gap-3 rounded-b-[calc(var(--radius-2xl)-1px)] border-t bg-muted/64 @5xl:px-6 px-4 py-3">
      <p className="text-muted-foreground sm:text-sm">
        <span className="font-medium text-foreground">Don’t want to wait?</span>{" "}
        Someone from the team can join in a minute or two.
      </p>
      <Button onClick={flow.meetNow} size="sm">
        <ZapIcon aria-hidden="true" />
        Meet now
      </Button>
    </div>
  );
}

function TimeLine({ flow }: StepProps) {
  if (flow.mode === "instant" && flow.stage !== "select") {
    return (
      <div className="flex gap-2">
        <CalendarIcon aria-hidden="true" className={metaIconClassName} />
        <span>Now</span>
      </div>
    );
  }
  if (flow.stage !== "select" && flow.date && flow.time) {
    return (
      <div className="flex gap-2">
        <CalendarIcon aria-hidden="true" className={metaIconClassName} />
        <span>
          {formatDate(flow.date)} {displayTimeLabel(flow.time, !flow.is24Hour)}
        </span>
      </div>
    );
  }
  return null;
}

function EventPane({ flow }: StepProps) {
  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <BookerAvatars
              avatars={flow.host ? undefined : team}
              fallbackName={flow.host ?? "Sales team"}
            />
            <p className="font-medium text-muted-foreground sm:text-sm">
              {flow.host ?? "Sales team"}
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
          <TimeLine flow={flow} />
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
        {flow.variant === "A" &&
        flow.offerInstant &&
        flow.stage === "select" ? (
          <MeetNowInPane flow={flow} />
        ) : null}
      </div>
    </div>
  );
}

/** The Booker's select step, unchanged, with the offer above it in B. */
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
    <div className="flex w-full flex-col">
      {flow.variant === "B" && flow.offerInstant ? (
        <MeetNowAboveCalendar flow={flow} />
      ) : null}
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
    </div>
  );
}

/** The chosen form. For an instant request, the button asks to meet now. */
function FormStep({ flow }: StepProps) {
  const left = simpleFields.filter(
    (field) => field.required && isFieldEmpty(flow.values[field.slug]),
  ).length;

  return (
    <form
      className={`${narrowStepClassName} flex flex-col gap-4`}
      onSubmit={(event) => {
        event.preventDefault();
        if (left === 0) {
          flow.submit();
        }
      }}
    >
      {simpleFields.map((field) => (
        <FieldBlock
          field={field}
          key={field.slug}
          lockPrefilled={false}
          setValue={flow.setValue}
          showErrors={false}
          values={flow.values}
        />
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
          <Button loading={flow.busy} type="submit">
            {flow.mode === "instant" ? "Meet now" : "Confirm"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** The new step: the request is out, the Booker waits for a host. */
function WaitingStep({ flow }: StepProps) {
  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      <div className="flex flex-col gap-2">
        <HourglassIcon
          aria-hidden="true"
          className="size-6 text-muted-foreground"
        />
        <h2 className="font-bold font-heading text-xl">
          Finding someone to join
        </h2>
        <p className="text-muted-foreground sm:text-sm">
          We’ve let the team know. Keep this page open: the meeting link will
          appear here as soon as someone accepts.
        </p>
      </div>
      <p className="sm:text-sm">
        <span className="text-muted-foreground">Time left to answer: </span>
        <span aria-live="off" className="font-medium tabular-nums">
          {formatCountdown(flow.secondsLeft)}
        </span>
      </p>
      <div className={`${barClassName} justify-end!`}>
        <Button onClick={flow.stopWaiting} variant="ghost">
          Stop waiting
        </Button>
      </div>
    </div>
  );
}

/** A host accepted: the link to join, not opened on the visitor's behalf. */
function JoinedStep({ flow }: StepProps) {
  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      <div className="flex flex-col gap-2">
        <CircleCheckIcon
          aria-hidden="true"
          className="size-6 text-success-foreground"
        />
        <h2 className="font-bold font-heading text-xl">{flow.host} is ready</h2>
        <p className="text-muted-foreground sm:text-sm">
          Join the call now. A confirmation is on its way to {getEmail(flow)}.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Button
          render={
            // biome-ignore lint/a11y/useAnchorContent: Button renders the children
            <a href={flow.videoLink} rel="noreferrer" target="_blank" />
          }
        >
          <VideoIcon aria-hidden="true" />
          Join the call
        </Button>
        <p className="break-all text-muted-foreground text-xs">
          {flow.videoLink}
        </p>
      </div>
    </div>
  );
}

const endCopy: Record<EndReason, { title: string; text: string }> = {
  expired: {
    text: "Nobody was free to join in time. Pick a time that suits you instead.",
    title: "No one picked up",
  },
  notNow: {
    text: "Instant meetings aren’t available at the moment. Pick a time that suits you instead.",
    title: "No one is available right now",
  },
  tooSoon: {
    text: "You asked for an instant meeting a few minutes ago. Pick a time that suits you instead.",
    title: "You’ve already asked recently",
  },
};

/** The request did not become a meeting. Normal scheduling is the way on. */
function EndedStep({ flow }: StepProps) {
  const copy = endCopy[flow.endReason];

  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      <div className="flex flex-col gap-2">
        <PhoneOffIcon
          aria-hidden="true"
          className="size-6 text-muted-foreground"
        />
        <h2 className="font-bold font-heading text-xl">{copy.title}</h2>
        <p className="text-muted-foreground sm:text-sm">{copy.text}</p>
      </div>
      <div className={`${barClassName} justify-end!`}>
        <Button onClick={flow.scheduleInstead}>Schedule a time instead</Button>
      </div>
    </div>
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

export function InstantBooker(props: StepProps) {
  const step = props.flow.stage;
  const showBar =
    props.flow.variant === "C" && props.flow.offerInstant && step === "select";

  return (
    // The bar wraps onto its own line under the pane and the steps.
    <Card className={cn(cardClassName, showBar && "flex-wrap")}>
      <EventPane {...props} />
      <BookerSteps step={step}>
        {step === "select" ? <SelectStep {...props} /> : null}
        {step === "form" ? <FormStep {...props} /> : null}
        {step === "waiting" ? <WaitingStep {...props} /> : null}
        {step === "joined" ? <JoinedStep {...props} /> : null}
        {step === "ended" ? <EndedStep {...props} /> : null}
        {step === "booked" ? <BookedStep {...props} /> : null}
      </BookerSteps>
      {showBar ? <MeetNowBar {...props} /> : null}
    </Card>
  );
}
