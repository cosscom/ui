import type { Registry } from "shadcn/schema";

export const booker: Registry["items"] = [
  {
    name: "booker",
    type: "registry:ui",
    description:
      "A Cal.com booking flow: pick a day and a time, fill in the form, and manage the booking.",
    dependencies: ["lucide-react", "marked", "isomorphic-dompurify"],
    registryDependencies: [
      "@coss/avatar",
      "@coss/badge",
      "@coss/button",
      "@coss/card",
      "@coss/combobox",
      "@coss/empty",
      "@coss/field",
      "@coss/form",
      "@coss/group",
      "@coss/input",
      "@coss/popover",
      "@coss/radio-group",
      "@coss/scroll-area",
      "@coss/segmented-control",
      "@coss/select",
      "@coss/skeleton",
      "@coss/textarea",
      "@coss/tooltip",
      "@coss/utils",
    ],
    files: [
      {
        path: "booker/booker-avatars.tsx",
        type: "registry:component",
        target: "@components/booker/booker-avatars.tsx",
      },
      {
        path: "booker/booker-calendar-model.ts",
        type: "registry:component",
        target: "@components/booker/booker-calendar-model.ts",
      },
      {
        path: "booker/booker-calendar.tsx",
        type: "registry:component",
        target: "@components/booker/booker-calendar.tsx",
      },
      {
        path: "booker/booker-confirm-form.tsx",
        type: "registry:component",
        target: "@components/booker/booker-confirm-form.tsx",
      },
      {
        path: "booker/booker-confirmation.tsx",
        type: "registry:component",
        target: "@components/booker/booker-confirmation.tsx",
      },
      {
        path: "booker/booker-error-state.tsx",
        type: "registry:component",
        target: "@components/booker/booker-error-state.tsx",
      },
      {
        path: "booker/booker-heading.ts",
        type: "registry:component",
        target: "@components/booker/booker-heading.ts",
      },
      {
        path: "booker/booker-labels.ts",
        type: "registry:component",
        target: "@components/booker/booker-labels.ts",
      },
      {
        path: "booker/booker-steps.tsx",
        type: "registry:component",
        target: "@components/booker/booker-steps.tsx",
      },
      {
        path: "booker/booker.tsx",
        type: "registry:component",
        target: "@components/booker/booker.tsx",
      },
      {
        path: "booker/duration-picker.tsx",
        type: "registry:component",
        target: "@components/booker/duration-picker.tsx",
      },
      {
        path: "booker/event-description.tsx",
        type: "registry:component",
        target: "@components/booker/event-description.tsx",
      },
      {
        path: "booker/event-meta.tsx",
        type: "registry:component",
        target: "@components/booker/event-meta.tsx",
      },
      {
        path: "booker/header-banner.tsx",
        type: "registry:component",
        target: "@components/booker/header-banner.tsx",
      },
      {
        path: "booker/hooks/use-booker.ts",
        type: "registry:component",
        target: "@components/booker/hooks/use-booker.ts",
      },
      {
        path: "booker/lib/actions.ts",
        type: "registry:component",
        target: "@components/booker/lib/actions.ts",
      },
      {
        path: "booker/lib/booker-utils.ts",
        type: "registry:component",
        target: "@components/booker/lib/booker-utils.ts",
      },
      {
        path: "booker/lib/booking-location.ts",
        type: "registry:component",
        target: "@components/booker/lib/booking-location.ts",
      },
      {
        path: "booker/lib/cal-api/bookings.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/bookings.ts",
      },
      {
        path: "booker/lib/cal-api/client.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/client.ts",
      },
      {
        path: "booker/lib/cal-api/env.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/env.ts",
      },
      {
        path: "booker/lib/cal-api/event-types.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/event-types.ts",
      },
      {
        path: "booker/lib/cal-api/public-event.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/public-event.ts",
      },
      {
        path: "booker/lib/cal-api/slots.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/slots.ts",
      },
      {
        path: "booker/lib/cal-api/types.ts",
        type: "registry:component",
        target: "@components/booker/lib/cal-api/types.ts",
      },
      {
        path: "booker/lib/target.ts",
        type: "registry:component",
        target: "@components/booker/lib/target.ts",
      },
      {
        path: "booker/location.tsx",
        type: "registry:component",
        target: "@components/booker/location.tsx",
      },
      {
        path: "booker/response-card.tsx",
        type: "registry:component",
        target: "@components/booker/response-card.tsx",
      },
      {
        path: "booker/segmented-radio-group.tsx",
        type: "registry:component",
        target: "@components/booker/segmented-radio-group.tsx",
      },
      {
        path: "booker/status-mark.tsx",
        type: "registry:component",
        target: "@components/booker/status-mark.tsx",
      },
      {
        path: "booker/time-picker.tsx",
        type: "registry:component",
        target: "@components/booker/time-picker.tsx",
      },
      {
        path: "booker/timezone-picker.tsx",
        type: "registry:component",
        target: "@components/booker/timezone-picker.tsx",
      },
      {
        path: "booker/use-booker-calendar-focus.ts",
        type: "registry:component",
        target: "@components/booker/use-booker-calendar-focus.ts",
      },
    ],
  },
];
