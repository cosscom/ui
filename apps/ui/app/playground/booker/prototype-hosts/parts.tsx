"use client";

// PROTOTYPE ONLY. Choosing which hosts of a collective event attend, as part
// of the Booker's select step: select → form → booked. The calendar and time
// list are the Booker's real ones and reload when the choice changes.
//
// The design system has no host picker. What is copied from it: the host
// identity (HostAvatars and its label) and the row and Select of its
// reschedule host preference.

import {
  CalendarIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  GlobeIcon,
  UserIcon,
  VideoIcon,
} from "lucide-react";
import { BookerAvatars } from "@/registry/default/atoms/booker/booker-avatars";
import { BookerCalendar } from "@/registry/default/atoms/booker/booker-calendar";
import { getBookerLabels } from "@/registry/default/atoms/booker/booker-labels";
import { BookerSteps } from "@/registry/default/atoms/booker/booker-steps";
import { TimePicker } from "@/registry/default/atoms/booker/time-picker";
import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import { FieldBlock, TermsNote } from "../prototype-form/field-block";
import {
  type FieldValue,
  type FieldValues,
  isFieldEmpty,
  simpleFields,
} from "../prototype-form/fixtures";
import { formatDate, startOfMonth, today } from "../prototype-manage/fixtures";
import { type Host, type Stage, teamName } from "./fixtures";
import { displayTimeLabel, getInitials } from "@/lib/booker/utils";

export type Flow = {
  stage: Stage;
  hostChoice: boolean;
  hosts: Host[];
  chosen: string[];
  setChosen: (usernames: string[]) => void;
  loading: boolean;
  times: string[];
  isDayAvailable: (date: Date) => boolean;
  nextAvailableDate: Date | null;
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
  invalidHosts: boolean;
  submit: () => void;
  backToSelect: () => void;
  busy: boolean;
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

function getEmail(flow: Flow) {
  const email = flow.values.email;
  return typeof email === "string" ? email.trim() : "";
}

function getChosenHosts(flow: Flow) {
  return flow.hosts.filter((host) => flow.chosen.includes(host.username));
}

function allChosen(flow: Flow) {
  return flow.chosen.length === flow.hosts.length;
}

/** The design system's host identity label, with the team's name for everyone. */
function getIdentityLabel(flow: Flow) {
  const chosen = getChosenHosts(flow);
  const first = chosen[0];
  if (allChosen(flow) || !first) {
    return teamName;
  }
  if (chosen.length === 1) {
    return first.name;
  }
  const rest = chosen.length - 1;
  return `${first.name} and ${rest} ${rest === 1 ? "other" : "others"}`;
}

function formatNames(names: string[]) {
  if (names.length <= 1) {
    return names.join("");
  }
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

function HostAvatar({ name }: { name: string }) {
  return (
    <Avatar className="[--avatar-size:--spacing(5)]">
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

/** The trigger's text: everyone, one name, or the first name and a count. */
function renderChosen(flow: Flow) {
  return (usernames: string[]) => {
    if (usernames.length === flow.hosts.length) {
      return "All hosts";
    }
    const first = flow.hosts.find((host) => host.username === usernames[0]);
    const more = usernames.length > 1 ? ` (+${usernames.length - 1} more)` : "";
    return <span className="truncate">{`${first?.name ?? ""}${more}`}</span>;
  };
}

/**
 * The hosts in a multiple Select, in the row the design system gives the
 * reschedule host preference. The last chosen host cannot be removed.
 */
function HostSelect({ flow }: StepProps) {
  const last = flow.chosen.length === 1 ? flow.chosen[0] : undefined;

  return (
    <div className="flex items-center gap-2 sm:text-sm">
      <UserIcon
        aria-hidden="true"
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
      />
      <Select
        multiple
        onValueChange={(next: string[]) => {
          if (next.length > 0) {
            flow.setChosen(next);
          }
        }}
        value={flow.chosen}
      >
        <SelectTrigger
          aria-label="Hosts who attend"
          className="w-auto min-w-0 shrink font-normal"
          size="sm"
        >
          <SelectValue>{renderChosen(flow)}</SelectValue>
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          {flow.hosts.map((host) => (
            <SelectItem
              disabled={host.username === last}
              key={host.username}
              value={host.username}
            >
              <span className="flex items-center gap-2">
                <HostAvatar name={host.name} />
                {host.name}
              </span>
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </div>
  );
}

/** After the select step, the choice is shown, no longer changed. */
function ChosenRow({ flow }: StepProps) {
  return (
    <div className="flex gap-2 sm:text-sm">
      <UserIcon
        aria-hidden="true"
        className="size-4.5 shrink-0 opacity-80 sm:size-4"
      />
      <span>
        {allChosen(flow)
          ? "All hosts"
          : formatNames(getChosenHosts(flow).map((host) => host.name))}
      </span>
    </div>
  );
}

function TimeLine({ flow }: StepProps) {
  if (flow.stage === "select" || !flow.date || !flow.time) {
    return null;
  }
  return (
    <div className="flex gap-2">
      <CalendarIcon aria-hidden="true" className={metaIconClassName} />
      <span>
        {formatDate(flow.date)} {displayTimeLabel(flow.time, !flow.is24Hour)}
      </span>
    </div>
  );
}

function EventPane({ flow }: StepProps) {
  const picking = flow.hostChoice && flow.stage === "select";

  return (
    <div className={sideClassName}>
      <div className="flex flex-col gap-6 @5xl:p-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <BookerAvatars
              avatars={getChosenHosts(flow).map((host) => ({
                avatarUrl: "",
                name: host.name,
                profileUrl: "",
              }))}
              fallbackName={teamName}
            />
            <p className="font-medium text-muted-foreground sm:text-sm">
              {getIdentityLabel(flow)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-bold font-heading @3xl:@max-5xl:text-lg text-xl">
              Product review
            </h1>
            <p className="text-muted-foreground sm:text-sm">
              Walk the team through your work and get feedback from everyone at
              once.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:text-sm">
          <TimeLine flow={flow} />
          <div className="flex items-center gap-2">
            <Clock3Icon aria-hidden="true" className={metaIconClassName} />
            <span>{labels.durationMinutes(45)}</span>
          </div>
          <div className="flex items-center gap-2">
            <VideoIcon aria-hidden="true" className={metaIconClassName} />
            <span>Cal Video</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon aria-hidden="true" className={metaIconClassName} />
            <span>Europe/Rome</span>
          </div>
          {picking ? <HostSelect flow={flow} /> : null}
          {flow.hostChoice && flow.stage !== "select" ? (
            <ChosenRow flow={flow} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** The Booker's select step: its real calendar and time list, reloading. */
function SelectStep({ flow }: StepProps) {
  const monthStart = startOfMonth(flow.month);
  const nextMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    1,
  );

  return (
    <div className="flex w-full @3xl:flex-row flex-col">
      <div className="flex @3xl:w-[min(28.75rem,100cqw-2*var(--booker-side))] w-full @3xl:shrink-0 flex-col items-center @3xl:@max-5xl:px-2 px-4 @3xl:@max-5xl:py-2 pt-3 pb-4">
        <BookerCalendar
          availabilityLoading={flow.loading}
          disabled={(day) => !flow.isDayAvailable(day)}
          locale="en-US"
          month={flow.month}
          onMonthChange={flow.setMonth}
          onSelect={(day) => flow.setDate(day)}
          selected={flow.date}
          startMonth={startOfMonth(today)}
          today={today}
        />
      </div>
      <TimePicker
        availabilityLoading={flow.loading}
        currentMonth={flow.month}
        daySlots={flow.times}
        goToDate={(day) => {
          flow.setMonth(startOfMonth(day));
          flow.setDate(day);
        }}
        hasAvailabilityInView={Boolean(
          flow.nextAvailableDate && flow.nextAvailableDate < nextMonth,
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
        nextAvailableDate={flow.nextAvailableDate}
        onIs24HourChange={flow.setIs24Hour}
        onSelectTime={flow.pickTime}
        selectedDate={flow.date}
      />
    </div>
  );
}

/** The chosen form, unchanged. */
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
      {flow.invalidHosts ? (
        <p
          className="flex gap-2 text-destructive-foreground sm:text-sm"
          role="alert"
        >
          <CircleAlertIcon aria-hidden="true" className="h-lh w-4 shrink-0" />
          One of the hosts you picked can no longer be booked for this event. Go
          back and pick the hosts again.
        </p>
      ) : null}
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
          <Button
            disabled={flow.invalidHosts}
            loading={flow.busy}
            type="submit"
          >
            Confirm
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Booked: who attends, as the booking says. */
function BookedStep({ flow }: StepProps) {
  const names = getChosenHosts(flow).map((host) => host.name);

  return (
    <div className={`${narrowStepClassName} flex min-h-64 flex-col gap-5`}>
      <div className="flex flex-col gap-2">
        <CircleCheckIcon
          aria-hidden="true"
          className="size-6 text-success-foreground"
        />
        <h2 className="font-bold font-heading text-xl">You’re booked</h2>
        <p className="text-muted-foreground sm:text-sm">
          A calendar invitation was sent to {getEmail(flow)}.
        </p>
      </div>
      <div className="flex flex-col gap-1 sm:text-sm">
        <p className="font-medium">Who attends</p>
        <p className="text-muted-foreground">{formatNames(names)}</p>
      </div>
    </div>
  );
}

export function HostsBooker(props: StepProps) {
  const step = props.flow.stage;

  return (
    <Card className={cardClassName}>
      <EventPane {...props} />
      <BookerSteps step={step}>
        {step === "select" ? <SelectStep {...props} /> : null}
        {step === "form" ? <FormStep {...props} /> : null}
        {step === "booked" ? <BookedStep {...props} /> : null}
      </BookerSteps>
    </Card>
  );
}
