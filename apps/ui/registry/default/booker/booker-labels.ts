export type BookerLabels = {
  errorNotFound: string;
  errorNotFoundDescription: string;
  errorUnpublished: string;
  errorUnpublishedDescription: string;
  errorNetwork: string;
  errorNetworkDescription: string;
  errorGeneric: string;
  errorGenericDescription: string;
  retry: string;
  durationMinutes: (minutes: number) => string;
  availableTimes: string;
  loadingTimes: string;
  findingFirstAvailable: string;
  timeFormat: string;
  hour12Short: string;
  hour12: string;
  hour24Short: string;
  hour24: string;
  noAvailableTimes: string;
  noTimesThisDay: string;
  viewFirstAvailability: string;
  noTimesInRange: string;
  findFirstAvailable: string;
  noTimesInWindow: string;
  loadTimesError: string;
  loadTimesErrorDescription: string;
  slotNormallyAvailable: string;
  slotHostOverride: string;
  slotCalendarBusy: string;
  slotCalendarAvailable: string;
  headerImageAlt: (hostName: string, eventTitle: string) => string;
  locationOptions: (count: number) => string;
  locationSelectOnNextStep: string;
  confirmYourName: string;
  confirmFirstName: string;
  confirmLastName: string;
  confirmEmail: string;
  confirmNameError: string;
  confirmFirstNameError: string;
  confirmLastNameError: string;
  confirmEmailError: string;
  confirmNotes: string;
  confirmNotesPlaceholder: string;
  confirmLocation: string;
  confirmGuestEmail: string;
  confirmGuestEmailPlaceholder: string;
  confirmRemoveGuest: string;
  confirmAddGuests: string;
  confirmBack: string;
  confirmSubmit: string;
  confirmSubmitting: string;
  confirmError: string;
  confirmSuccess: string;
  confirmTermsPrefix: string;
  confirmTerms: string;
  confirmPrivacyPolicy: string;
  confirmedTitle: string;
  confirmedText: (email: string) => string;
  pendingTitle: string;
  pendingText: (hostName: string, email: string) => string;
  confirmationGuests: string;
  confirmationNotes: string;
  addToCalendar: string;
  cancelBooking: string;
  reschedule: string;
};

const DEFAULT_BOOKER_LABELS: BookerLabels = {
  // The error card's strings follow Cal Video's (no meeting found).
  errorNotFound: "Link not found",
  errorNotFoundDescription:
    "This booking link doesn’t exist. Contact the host for an updated link.",
  errorUnpublished: "Link not available",
  errorUnpublishedDescription:
    "This event isn’t published, so it can’t take bookings. Contact the host or ask them to publish it.",
  errorNetwork: "Can’t reach Cal.com",
  errorNetworkDescription: "Check your internet connection and try again.",
  errorGeneric: "Something went wrong",
  errorGenericDescription: "The booker couldn’t load. Try again in a moment.",
  retry: "Try again",
  durationMinutes: (minutes) => `${minutes} min`,
  // The time list's strings are the design system's (Booker time slots).
  availableTimes: "Available times",
  loadingTimes: "Loading available times",
  findingFirstAvailable: "Finding the first available time",
  timeFormat: "Time format",
  hour12Short: "12h",
  hour12: "12h (12-hour format)",
  hour24Short: "24h",
  hour24: "24h (24-hour format)",
  noAvailableTimes: "No available times",
  noTimesThisDay: "There are no times on this day. Try another date.",
  viewFirstAvailability: "View first availability",
  noTimesInRange: "No availability in the dates checked so far.",
  findFirstAvailable: "Find first available time",
  noTimesInWindow: "There is no availability in this event's booking window.",
  loadTimesError: "Couldn’t load available times",
  loadTimesErrorDescription: "Try again to check this date.",
  slotNormallyAvailable: "Normally available",
  slotHostOverride: "Available only with host override",
  slotCalendarBusy: "Busy in your calendar",
  slotCalendarAvailable: "Available in your calendar",
  headerImageAlt: (hostName, eventTitle) =>
    `Banner for ${eventTitle} with ${hostName}`,
  locationOptions: (count) => `${count} location options`,
  locationSelectOnNextStep: "Select on the next step",
  confirmYourName: "Your name",
  confirmFirstName: "First name",
  confirmLastName: "Last name",
  confirmEmail: "Email address",
  confirmNameError: "Please enter your name.",
  confirmFirstNameError: "Please enter your first name.",
  confirmLastNameError: "Please enter your last name.",
  confirmEmailError: "Please enter a valid email address.",
  confirmNotes: "Additional notes",
  confirmNotesPlaceholder:
    "Please share anything that will help prepare for our meeting.",
  confirmLocation: "Location",
  confirmGuestEmail: "Guest email",
  confirmGuestEmailPlaceholder: "guest@example.com",
  confirmRemoveGuest: "Remove guest",
  confirmAddGuests: "Add guests",
  confirmBack: "Back",
  confirmSubmit: "Confirm",
  confirmSubmitting: "Confirming…",
  confirmError: "Could not create booking. Please try again.",
  confirmSuccess: "Booking confirmed",
  confirmTermsPrefix: "By proceeding, you agree to Cal.com's",
  confirmTerms: "Terms",
  confirmPrivacyPolicy: "Privacy Policy",
  // The confirmation screen ("The confirmation screen", first-draft wording).
  confirmedTitle: "You’re booked",
  confirmedText: (email) => `A calendar invitation is on its way to ${email}.`,
  pendingTitle: "Waiting for confirmation",
  pendingText: (hostName, email) =>
    `${hostName} needs to confirm this booking. We’ll email ${email} when they do.`,
  confirmationGuests: "Guests",
  confirmationNotes: "Notes",
  addToCalendar: "Add to calendar",
  cancelBooking: "Cancel booking",
  reschedule: "Reschedule",
};

export function getBookerLabels(labels?: Partial<BookerLabels>): BookerLabels {
  return { ...DEFAULT_BOOKER_LABELS, ...labels };
}
