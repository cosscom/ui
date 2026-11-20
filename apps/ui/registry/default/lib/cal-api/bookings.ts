import "server-only";

import { calApi } from "./client";
import type { Booking, CreateBookingInput } from "./types";

export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  return calApi<Booking>("/bookings", {
    body: input,
    method: "POST",
  });
}
