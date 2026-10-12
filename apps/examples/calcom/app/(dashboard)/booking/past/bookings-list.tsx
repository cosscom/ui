"use client";

import { Badge } from "@coss/ui/components/badge";
import { Button, buttonVariants } from "@coss/ui/components/button";
import {
  Card,
  CardFrame,
  CardFrameFooter,
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
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@coss/ui/components/select";
import { TooltipProvider } from "@coss/ui/components/tooltip";
import { cn } from "@coss/ui/lib/utils";
import {
  BanknoteIcon,
  CircleDashedIcon,
  CircleXIcon,
  RefreshCcwIcon,
  RepeatIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookingsListSkeleton } from "../booking-skeleton";
import { BookingActions } from "./booking-actions";
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
import {
  formatBookingDate,
  formatBookingTime,
  getBookingParticipants,
  getLocationLabel,
  mockPastBookings,
} from "@/lib/mock-bookings-data";

const ARTIFICIAL_DELAY_MS = 800;

export function BookingsList() {
  const showLoading = useLoadingState(ARTIFICIAL_DELAY_MS);
  const bookings = mockPastBookings;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const totalCount = bookings.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedBookings = bookings.slice(startIndex, endIndex);

  const hasPreviousPage = pageIndex > 0;
  const hasNextPage = pageIndex < totalPages - 1;

  if (showLoading) {
    return <BookingsListSkeleton />;
  }

  return (
    <TooltipProvider delay={150} timeout={0}>
      <CardFrame>
        <Card>
          <CardPanel className="p-0">
            {paginatedBookings.map((booking, _index) => {
              const dateStr = formatBookingDate(
                booking.startTime,
                booking.endTime,
              );
              const timeStr = formatBookingTime(
                booking.startTime,
                booking.endTime,
              );
              const participants = getBookingParticipants(booking);
              const locationLabel = getLocationLabel(booking.location);
              const eventTypeColorLight =
                booking.eventType?.eventTypeColor?.lightEventTypeColor;
              const eventTypeColorDark =
                booking.eventType?.eventTypeColor?.darkEventTypeColor;
              const isPaid = booking.paid;
              const isRecurring = booking.recurringEventId !== null;
              const isCancelled = booking.status === "CANCELLED";
              const isPending = booking.status === "PENDING";
              const isRejected = booking.status === "REJECTED";
              const isRescheduled = booking.rescheduled;
              const teamName = booking.eventType?.team?.name;

              return (
                <ListItem key={booking.id}>
                  <ItemLabel
                    colorDark={eventTypeColorDark ?? undefined}
                    colorLight={eventTypeColorLight ?? undefined}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:gap-4">
                    <ListItemContent>
                      <ListItemHeader>
                        <ListItemTitle
                          className={cn(isCancelled && "line-through")}
                        >
                          <ListItemSpanningTrigger render={<Link href="#" />}>
                            {booking.title}
                          </ListItemSpanningTrigger>
                        </ListItemTitle>
                        <ListItemDescription>
                          {participants}
                        </ListItemDescription>
                      </ListItemHeader>

                      <ListItemBadges>
                        {isCancelled && (
                          <Badge
                            className="pointer-events-none"
                            variant="error"
                          >
                            <CircleXIcon />
                            Cancelled
                          </Badge>
                        )}
                        {isPending && (
                          <Badge
                            className="pointer-events-none"
                            variant="warning"
                          >
                            <CircleDashedIcon />
                            Unconfirmed
                          </Badge>
                        )}
                        {isRescheduled && (
                          <Badge
                            className="pointer-events-none"
                            variant="warning"
                          >
                            <RefreshCcwIcon />
                            Rescheduled
                          </Badge>
                        )}
                        {isRejected && !isRescheduled && (
                          <Badge
                            className="pointer-events-none"
                            variant="secondary"
                          >
                            Rejected
                          </Badge>
                        )}
                        {teamName && (
                          <Badge
                            className="pointer-events-none"
                            variant="outline"
                          >
                            <UsersIcon />
                            {teamName}
                          </Badge>
                        )}
                        {isPaid && (
                          <Badge
                            className="pointer-events-none"
                            variant="outline"
                          >
                            <BanknoteIcon />
                            Paid
                          </Badge>
                        )}
                        {isRecurring && (
                          <Badge
                            className="pointer-events-none"
                            variant="outline"
                          >
                            <RepeatIcon />
                            Recurring
                          </Badge>
                        )}
                      </ListItemBadges>
                    </ListItemContent>

                    <div className="flex flex-col items-start gap-2 md:-order-1 md:w-36 md:shrink-0">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm">{dateStr}</p>
                        <p className="text-muted-foreground text-sm">
                          {timeStr}
                        </p>
                      </div>
                      {locationLabel && (
                        <Link
                          className={buttonVariants({
                            className: "pointer-events-auto",
                            size: "xs",
                            variant: "outline",
                          })}
                          href="#join"
                        >
                          <VideoIcon />
                          {locationLabel}
                        </Link>
                      )}
                    </div>
                  </div>

                  <ListItemActions>
                    <BookingActions />
                  </ListItemActions>
                </ListItem>
              );
            })}
          </CardPanel>
        </Card>

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
                {startIndex + 1}-{endIndex} of {totalCount}
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
      </CardFrame>
    </TooltipProvider>
  );
}
