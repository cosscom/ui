import type { Metadata } from "next";
import { Booker } from "@/registry/default/booker/booker";
import { fetchRawBookerDataAction } from "@/registry/default/booker/lib/actions";
import type { BookerTarget } from "@/registry/default/booker/lib/target";

export const metadata: Metadata = {
  title: "Booker Playground - coss ui",
};

const defaultBookingUrl = "https://i.cal.com/pasquale/15min";
const timeZone = "Europe/Rome";

type BookerPlaygroundPageProps = {
  searchParams: Promise<{ bookingUrl?: string | string[] }>;
};

// Temporary demo page. Pass `?bookingUrl=` to point the Booker at another
// event, e.g. `?bookingUrl=cal.com/rickastley/15min`.
export default async function BookerPlaygroundPage({
  searchParams,
}: BookerPlaygroundPageProps) {
  const { bookingUrl } = await searchParams;
  const target = {
    bookingUrl:
      typeof bookingUrl === "string" && bookingUrl.trim()
        ? bookingUrl
        : defaultBookingUrl,
    type: "link",
  } satisfies BookerTarget;

  const initialInput = {
    fetchMeta: true,
    monthIso: new Date().toISOString(),
    monthsToFetch: 3,
    target,
    timeZone,
  };
  const initialData = {
    monthIso: initialInput.monthIso,
    monthsToFetch: initialInput.monthsToFetch,
    result: await fetchRawBookerDataAction(initialInput),
    timeZone: initialInput.timeZone,
  };

  return (
    <main className="container flex min-h-svh w-full items-center py-10">
      <Booker initialData={initialData} target={target} />
    </main>
  );
}
