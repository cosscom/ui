"use client";

import { Badge } from "@coss/ui/components/badge";
import { Button, buttonVariants } from "@coss/ui/components/button";
import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@coss/ui/components/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@coss/ui/components/pagination";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@coss/ui/components/popover";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@coss/ui/components/select";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@coss/ui/components/tooltip";
import { cn } from "@coss/ui/lib/utils";
import { BanknoteIcon, RepeatIcon, SendIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookingActions } from "./booking-actions";
import { BookingsListSkeleton } from "./booking-skeleton";
import { ItemLabel } from "@/components/item-label";
import {
  ListItem,
  ListItemActions,
  ListItemBadges,
  ListItemContent,
  ListItemDescription,
  ListItemHeader,
  ListItemSpanningTrigger,
  ListItemTitle,
} from "@/components/list-item";
import { useLoadingState } from "@/hooks/use-loading-state";
import type { Booking } from "@/lib/mock-bookings-data";
import {
  formatBookingDate,
  formatBookingTime,
  getBookingParticipants,
  getLocationLabel,
  isBookingToday,
} from "@/lib/mock-bookings-data";

const ARTIFICIAL_DELAY_MS = 800;

type BookingListingStatus =
  | "upcoming"
  | "past"
  | "cancelled"
  | "unconfirmed"
  | "recurring";

type BookingsListProps = {
  bookings: Booking[];
  listingStatus: BookingListingStatus;
};

export function BookingsList({ bookings, listingStatus }: BookingsListProps) {
  const showLoading = useLoadingState(ARTIFICIAL_DELAY_MS);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const isUpcoming = listingStatus === "upcoming";

  const { todayBookings, nextBookings } = useMemo(() => {
    if (!isUpcoming) {
      return { todayBookings: [], nextBookings: bookings };
    }

    const today: Booking[] = [];
    const next: Booking[] = [];

    for (const booking of bookings) {
      if (isBookingToday(booking.startTime)) {
        today.push(booking);
      } else {
        next.push(booking);
      }
    }

    return { todayBookings: today, nextBookings: next };
  }, [bookings, isUpcoming]);

  const paginatedSource = isUpcoming ? nextBookings : bookings;
  const totalCount = paginatedSource.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedBookings = paginatedSource.slice(startIndex, endIndex);

  const hasPreviousPage = pageIndex > 0;
  const hasNextPage = pageIndex < totalPages - 1;

  if (showLoading) {
    return <BookingsListSkeleton />;
  }

  const renderBooking = (booking: Booking) => (
    <BookingListItem
      booking={booking}
      key={booking.id}
      listingStatus={listingStatus}
    />
  );

  return (
    <TooltipProvider delay={0} timeout={0}>
      <CardFrame className="**:[[data-slot=card-frame-header]+[data-slot=card]]:rounded-t-none **:[[data-slot=card-frame-header]+[data-slot=card]_[data-slot=list-item]]:rounded-t-none **:[[data-slot=card]:has(+[data-slot=card-frame-header])]:rounded-b-none **:[[data-slot=card]:has(+[data-slot=card-frame-header])_[data-slot=list-item]]:rounded-b-none">
        {isUpcoming && todayBookings.length > 0 && (
          <>
            <CardFrameHeader className="py-3">
              <CardFrameTitle className="font-medium text-muted-foreground">
                Today
              </CardFrameTitle>
            </CardFrameHeader>
            <Card>
              <CardPanel className="p-0">
                {todayBookings.map(renderBooking)}
              </CardPanel>
            </Card>
          </>
        )}

        {isUpcoming && nextBookings.length > 0 ? (
          <>
            <CardFrameHeader className="py-3">
              <CardFrameTitle className="font-medium text-muted-foreground">
                Next
              </CardFrameTitle>
            </CardFrameHeader>
            <Card>
              <CardPanel className="p-0">
                {paginatedBookings.map(renderBooking)}
              </CardPanel>
            </Card>
          </>
        ) : (
          !isUpcoming && (
            <Card>
              <CardPanel className="p-0">
                {paginatedBookings.map(renderBooking)}
              </CardPanel>
            </Card>
          )
        )}

        {(totalCount > 0 || !isUpcoming) && (
          <CardFrameFooter>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(value) => {
                    if (value !== null) {
                      setPageSize(value);
                      setPageIndex(0);
                    }
                  }}
                  value={pageSize}
                >
                  <SelectTrigger
                    aria-label="Rows per page"
                    className="w-fit min-w-none"
                    size="sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectItem value={10}>10</SelectItem>
                    <SelectItem value={20}>20</SelectItem>
                    <SelectItem value={50}>50</SelectItem>
                  </SelectPopup>
                </Select>
                <p className="text-muted-foreground text-sm">rows per page</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="whitespace-nowrap text-muted-foreground text-sm">
                  {totalCount === 0
                    ? "0 of 0"
                    : `${startIndex + 1}-${endIndex} of ${totalCount}`}
                </p>
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        render={
                          <Button
                            disabled={!hasPreviousPage}
                            onClick={() => setPageIndex(pageIndex - 1)}
                            size="sm"
                            variant="outline"
                          />
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        render={
                          <Button
                            disabled={!hasNextPage}
                            onClick={() => setPageIndex(pageIndex + 1)}
                            size="sm"
                            variant="outline"
                          />
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </CardFrameFooter>
        )}
      </CardFrame>
    </TooltipProvider>
  );
}

function BookingListItem({
  booking,
  listingStatus,
}: {
  booking: Booking;
  listingStatus: BookingListingStatus;
}) {
  const dateStr = formatBookingDate(booking.startTime, booking.endTime);
  const timeStr = formatBookingTime(booking.startTime, booking.endTime);
  const participants = getBookingParticipants(booking);
  const locationLabel = getLocationLabel(booking.location);
  const eventTypeColorLight =
    booking.eventType?.eventTypeColor?.lightEventTypeColor;
  const eventTypeColorDark =
    booking.eventType?.eventTypeColor?.darkEventTypeColor;
  const isCancelled = booking.status === "CANCELLED";
  const isPending = booking.status === "PENDING";
  const isRejected = booking.status === "REJECTED";
  const isTabRecurring = listingStatus === "recurring";
  const isRescheduled = booking.fromReschedule !== null;
  const recurringEventsRemaining = getBookingMetadataNumber(
    booking,
    "recurringEventsRemaining",
  );
  const assignmentReason = booking.assignmentReason.at(-1);
  const showRejected =
    isRejected && !isRescheduled && booking.assignmentReason.length === 0;
  const showRecurringDates =
    (listingStatus === "recurring" ||
      listingStatus === "unconfirmed" ||
      listingStatus === "cancelled") &&
    booking.recurringEventId !== null &&
    typeof recurringEventsRemaining === "number";
  const teamName = booking.eventType?.team?.name;
  const showPendingPayment =
    (booking.eventType?.price ?? 0) > 0 &&
    !booking.payment.some((payment) => payment.success);
  const showPaidBadge =
    booking.paid && booking.payment.some((payment) => payment.success);
  const showPaymentError = booking.paid && booking.payment.length === 0;
  const paidLabel =
    booking.payment[0]?.paymentOption === "HOLD" ? "Card held" : "Paid";
  const showJoinLink =
    listingStatus === "upcoming" &&
    !isPending &&
    !isCancelled &&
    !isRejected &&
    locationLabel;
  const showRescheduleRequestSentBadge = isCancelled && booking.rescheduled;
  const [attendees, setAttendees] = useState(booking.attendees);

  return (
    <ListItem>
      <ItemLabel
        colorDark={eventTypeColorDark ?? undefined}
        colorLight={eventTypeColorLight ?? undefined}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:gap-4">
        <ListItemContent>
          <ListItemHeader>
            <ListItemTitle className="space-x-2">
              <ListItemSpanningTrigger
                className={cn(isCancelled && "line-through")}
                render={<Link href="#" />}
              >
                {booking.title}
              </ListItemSpanningTrigger>
              {showRescheduleRequestSentBadge && (
                <span className="inline-flex h-lh items-center align-bottom">
                  <Badge className="pointer-events-none" variant="secondary">
                    <SendIcon aria-hidden="true" />
                    Reschedule request sent
                  </Badge>
                </span>
              )}
              {showPendingPayment && (
                <span className="inline-flex h-lh items-center align-bottom">
                  <Badge className="pointer-events-none" variant="warning">
                    <BanknoteIcon aria-hidden="true" />
                    Pending payment
                  </Badge>
                </span>
              )}
            </ListItemTitle>
            {participants && (
              <ListItemDescription>{participants}</ListItemDescription>
            )}
            {booking.description && (
              <ListItemDescription className="line-clamp-2">
                {booking.description}
              </ListItemDescription>
            )}
          </ListItemHeader>

          <ListItemBadges>
            {isPending && (
              <Badge className="pointer-events-none" variant="warning">
                Unconfirmed
              </Badge>
            )}
            {isRescheduled && <RescheduledBadge booking={booking} />}
            {showRejected && (
              <Badge className="pointer-events-none" variant="secondary">
                Rejected
              </Badge>
            )}
            {teamName && (
              <Badge className="pointer-events-none" variant="outline">
                {teamName}
              </Badge>
            )}
            {assignmentReason && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Badge className="pointer-events-none" variant="outline">
                      {getAssignmentReasonLabel(assignmentReason.reasonString)}
                    </Badge>
                  }
                />
                <TooltipPopup>{assignmentReason.reasonString}</TooltipPopup>
              </Tooltip>
            )}
            {booking.report && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Badge className="pointer-events-none" variant="error">
                      Reported
                    </Badge>
                  }
                />
                <TooltipPopup>
                  {booking.report.description
                    ? `${booking.report.reason}: ${booking.report.description}`
                    : booking.report.reason}
                </TooltipPopup>
              </Tooltip>
            )}
            {showPaymentError && (
              <Badge className="pointer-events-none" variant="warning">
                Error collecting card
              </Badge>
            )}
            {showPaidBadge && (
              <Badge className="pointer-events-none" variant="success">
                {paidLabel}
              </Badge>
            )}
            {showRecurringDates && (
              <RecurringDatesPopover count={recurringEventsRemaining} />
            )}
          </ListItemBadges>
        </ListItemContent>

        <div className="flex flex-col items-start gap-2 md:-order-1 md:w-40 md:shrink-0">
          <div className="flex w-full min-w-0 flex-col items-start gap-1">
            <p className="font-medium text-sm">{dateStr}</p>
            <MeetingTimeInTimezonesPopover
              booking={booking}
              timeStr={timeStr}
            />
          </div>
          {showJoinLink && (
            <Link
              className={buttonVariants({
                className:
                  "pointer-events-auto min-w-0 max-w-full whitespace-normal",
                size: "xs",
                variant: "outline",
              })}
              href="#join"
              title={locationLabel}
            >
              <VideoIcon />
              <span className="truncate">{locationLabel}</span>
            </Link>
          )}
        </div>
      </div>

      <ListItemActions>
        <BookingActions
          attendees={attendees}
          booking={booking}
          isRecurring={isTabRecurring}
          listingStatus={listingStatus}
          onAttendeesChange={setAttendees}
          showPendingActions={isPending}
        />
      </ListItemActions>
    </ListItem>
  );
}

function MeetingTimeInTimezonesPopover({
  booking,
  timeStr,
}: {
  booking: Booking;
  timeStr: string;
}) {
  const userTimeZone = booking.user?.timeZone ?? "Europe/Rome";
  const timezoneEntries = getMeetingTimezoneEntries(booking, userTimeZone);

  if (timezoneEntries.length <= 1) {
    return <p className="text-muted-foreground text-sm">{timeStr}</p>;
  }

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        render={
          <button
            className="relative cursor-pointer text-left text-muted-foreground text-sm decoration-current/32 decoration-dotted underline-offset-2 hover:text-foreground hover:underline"
            onClick={(event) => event.stopPropagation()}
            type="button"
          />
        }
      >
        {timeStr}
      </PopoverTrigger>
      <PopoverPopup side="top" tooltipStyle>
        <div className="tabular-nums">
          {timezoneEntries.map((entry) => (
            <div className="not-first:mt-2" key={entry.timeZone}>
              <div className="inline-flex items-baseline gap-2">
                <span>
                  {entry.startTime} - {entry.endTime}
                </span>
                {entry.dayOffset !== 0 && (
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px]">
                    {entry.dayOffset > 0 ? "+1" : "-1"}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground">{entry.timeZone}</div>
            </div>
          ))}
        </div>
      </PopoverPopup>
    </Popover>
  );
}

function getMeetingTimezoneEntries(booking: Booking, userTimeZone: string) {
  if (booking.attendees.length === 0) {
    return [];
  }

  const uniqueTimezones = [
    userTimeZone,
    ...booking.attendees.map((attendee) => attendee.timeZone),
  ].filter(
    (timeZone, index, timeZones) => timeZones.indexOf(timeZone) === index,
  );

  if (uniqueTimezones.length <= 1) {
    return [];
  }

  const referenceDateKey = getDateKeyInTimezone(
    booking.startTime,
    userTimeZone,
  );

  return uniqueTimezones.map((timeZone) => {
    const dateKey = getDateKeyInTimezone(booking.startTime, timeZone);
    let dayOffset = 0;

    if (dateKey > referenceDateKey) {
      dayOffset = 1;
    } else if (dateKey < referenceDateKey) {
      dayOffset = -1;
    }

    return {
      dayOffset,
      endTime: formatTimeInTimezone(booking.endTime, timeZone),
      startTime: formatTimeInTimezone(booking.startTime, timeZone),
      timeZone,
    };
  });
}

function formatTimeInTimezone(date: Date, timeZone: string): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    timeZone,
  });
}

function getDateKeyInTimezone(date: Date, timeZone: string): string {
  return date.toLocaleDateString("en-CA", { timeZone });
}

function RescheduledBadge({ booking }: { booking: Booking }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Badge className="pointer-events-none" variant="warning">
            Rescheduled
          </Badge>
        }
      />
      <TooltipPopup>
        {booking.rescheduledBy
          ? `Rescheduled by ${booking.rescheduledBy}`
          : "This booking was rescheduled"}
      </TooltipPopup>
    </Tooltip>
  );
}

function RecurringDatesPopover({ count }: { count: number }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        render={
          <button
            className="relative flex cursor-pointer items-center gap-1 px-0.5 text-muted-foreground text-xs decoration-current/32 decoration-dotted underline-offset-2 hover:text-foreground hover:underline"
            onClick={(event) => event.stopPropagation()}
            type="button"
          />
        }
      >
        <RepeatIcon className="size-3 opacity-80" aria-hidden="true" />
        {count} {count === 1 ? "event" : "events"} remaining
      </PopoverTrigger>
      <PopoverPopup side="top" tooltipStyle>
        <div className="tabular-nums">
          {recurringDatesPreview.map((date) => (
            <div
              className={cn(date.completed && "line-through")}
              key={date.label}
            >
              {date.label}
            </div>
          ))}
        </div>
      </PopoverPopup>
    </Popover>
  );
}

const recurringDatesPreview = [
  { completed: true, label: "5:01pm - 8 May 2026" },
  { completed: true, label: "5:01pm - 15 May 2026" },
  { completed: false, label: "5:01pm - 22 May 2026" },
  { completed: false, label: "5:01pm - 29 May 2026" },
  { completed: false, label: "5:01pm - 5 June 2026" },
  { completed: false, label: "5:01pm - 12 June 2026" },
];

function getAssignmentReasonLabel(reasonString: string): string {
  if (/round robin/i.test(reasonString)) {
    return "Round robin";
  }

  return "Assigned";
}

function getBookingMetadataNumber(booking: Booking, key: string) {
  const value = booking.metadata?.[key];
  return typeof value === "number" ? value : null;
}
