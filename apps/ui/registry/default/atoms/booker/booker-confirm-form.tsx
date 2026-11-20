"use client";

import { UserPlusIcon, XIcon } from "lucide-react";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import { Group } from "@/registry/default/ui/group";
import { Input } from "@/registry/default/ui/input";
import { Textarea } from "@/registry/default/ui/textarea";
import type { BookerLabels } from "./booker-labels";
import { getLocationOptionValue, LocationPicker } from "./location";
import { createBookingAction } from "@/lib/booker/actions";
import type { BookerConfirmFormContext } from "@/lib/booker/use-booker";
import { toCalendarDateKey } from "@/lib/booker/utils";
import type { Booking } from "@/lib/cal-api/types";

export type BookerConfirmFormProps = BookerConfirmFormContext & {
  defaultEmail?: string;
  defaultName?: string;
  labels: BookerLabels;
  onSuccess?: (booking: Booking) => void;
};

function RequiredMark() {
  return <span className="text-destructive-foreground">*</span>;
}

function getDefaultLocationProvider(
  locations: BookerConfirmFormContext["locations"],
): string {
  const location = locations?.[0];
  if (!location) {
    return "";
  }

  return location.provider || getLocationOptionValue(location, 0);
}

export function BookerConfirmForm({
  defaultEmail,
  defaultName,
  disableGuests = false,
  durationMinutes,
  includeLengthInMinutes,
  labels,
  locale,
  locations = [],
  onBack,
  onSuccess,
  selectedDate,
  selectedTime,
  target,
  timeZone,
}: BookerConfirmFormProps) {
  const nextGuestIdRef = useRef(0);
  const [guestIds, setGuestIds] = useState<number[]>([]);
  const [locationProvider, setLocationProvider] = useState(() =>
    getDefaultLocationProvider(locations),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  const resolvedLocationProvider =
    locations.length > 1
      ? locationProvider || getDefaultLocationProvider(locations)
      : getDefaultLocationProvider(locations);

  const handleAddGuest = () => {
    const id = nextGuestIdRef.current;
    nextGuestIdRef.current += 1;
    setGuestIds((current) => [...current, id]);
  };

  const handleRemoveGuest = (id: number) => {
    setGuestIds((current) => current.filter((guestId) => guestId !== id));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!selectedDate || !selectedTime) {
      setSubmitError(labels.confirmError);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();
    const guests = formData
      .getAll("guests")
      .map((value) => String(value).trim())
      .filter(Boolean);

    if (!name || !email) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await createBookingAction({
        email,
        guests: guests.length > 0 ? guests : undefined,
        ...(includeLengthInMinutes && durationMinutes
          ? { lengthInMinutes: durationMinutes }
          : {}),
        locale,
        locationProvider: resolvedLocationProvider || undefined,
        name,
        notes: notes || undefined,
        selectedDateKey: toCalendarDateKey(selectedDate),
        selectedTime,
        target,
        timeZone,
      });

      if (!result.ok) {
        setSubmitError(result.error || labels.confirmError);
        return;
      }

      setSuccessBooking(result.booking);
      onSuccess?.(result.booking);
    } catch {
      setSubmitError(labels.confirmError);
    } finally {
      setSubmitting(false);
    }
  };

  if (successBooking) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium text-base sm:text-sm">
          {labels.confirmSuccess}
        </p>
        {successBooking.meetingUrl ? (
          <p className="text-muted-foreground text-sm">
            <a
              className="text-foreground underline-offset-4 hover:underline"
              href={successBooking.meetingUrl}
              rel="noreferrer"
              target="_blank"
            >
              {successBooking.meetingUrl}
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field name="name">
          <FieldLabel>
            {labels.confirmYourName} <RequiredMark />
          </FieldLabel>
          <Input autoFocus defaultValue={defaultName} required type="text" />
          <FieldError>{labels.confirmNameError}</FieldError>
        </Field>

        <Field name="email">
          <FieldLabel>
            {labels.confirmEmail} <RequiredMark />
          </FieldLabel>
          <Input
            autoComplete="email"
            defaultValue={defaultEmail}
            required
            type="email"
          />
          <FieldError>{labels.confirmEmailError}</FieldError>
        </Field>

        <LocationPicker
          label={labels.confirmLocation}
          locations={locations}
          onValueChange={setLocationProvider}
        />

        <Field name="notes">
          <FieldLabel>{labels.confirmNotes}</FieldLabel>
          <Textarea placeholder={labels.confirmNotesPlaceholder} rows={3} />
        </Field>

        {guestIds.length > 0 ? (
          <div className="flex flex-col gap-2">
            {guestIds.map((guestId) => (
              <Group
                key={guestId}
                aria-label={labels.confirmGuestEmail}
                className="w-full gap-2"
              >
                <Input
                  aria-label={labels.confirmGuestEmail}
                  className="flex-1"
                  name="guests"
                  placeholder={labels.confirmGuestEmailPlaceholder}
                  type="email"
                />
                <div>
                  <Button
                    aria-label={labels.confirmRemoveGuest}
                    onClick={() => handleRemoveGuest(guestId)}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </div>
              </Group>
            ))}
          </div>
        ) : null}

        {!disableGuests ? (
          <Button
            className="h-auto! self-start px-0.5"
            onClick={handleAddGuest}
            type="button"
            variant="link"
          >
            <UserPlusIcon aria-hidden="true" />
            {labels.confirmAddGuests}
          </Button>
        ) : null}

        {submitError ? (
          <p className="text-destructive-foreground text-xs" role="alert">
            {submitError}
          </p>
        ) : null}

        <p className="text-muted-foreground text-xs">
          {labels.confirmTermsPrefix}{" "}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href="https://cal.com/terms"
            rel="noreferrer"
            target="_blank"
          >
            {labels.confirmTerms}
          </a>{" "}
          and{" "}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href="https://cal.com/privacy"
            rel="noreferrer"
            target="_blank"
          >
            {labels.confirmPrivacyPolicy}
          </a>
          .
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            disabled={submitting}
            onClick={onBack}
            type="button"
            variant="ghost"
          >
            {labels.confirmBack}
          </Button>
          <Button loading={submitting} type="submit">
            {submitting ? labels.confirmSubmitting : labels.confirmSubmit}
          </Button>
        </div>
      </Form>
    </div>
  );
}
