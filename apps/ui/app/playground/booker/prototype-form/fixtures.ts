// PROTOTYPE ONLY. Synthetic booking fields, modelled on the shape Cal's API
// returns for event types on version 2026-06-12. No network.

export type FieldKind =
  | "name"
  | "email"
  | "phone"
  | "location"
  | "shortText"
  | "longText"
  | "number"
  | "select"
  | "multiSelect"
  | "radioGroup"
  | "checkboxGroup"
  | "checkbox"
  | "url"
  | "address"
  | "guests"
  | "unknown";

export type FieldValue = string | string[] | boolean;
export type FieldValues = Record<string, FieldValue | undefined>;

export type LocationOption = {
  label: string;
  // What the attendee must supply when they pick this option.
  input?: "phone" | "address";
};

export type ProtoField = {
  slug: string;
  kind: FieldKind;
  label: string;
  // System fields come from Cal; the rest are the host's custom questions.
  system: boolean;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  locationOptions?: LocationOption[];
  showWhen?: { fieldSlug: string; anyOf: string[] };
  // Shown in the "Errors" scenario.
  error?: string;
  // Used in the "Prefilled" scenario.
  prefill?: FieldValue;
  lockedOnPrefill?: boolean;
};

export const simpleFields: ProtoField[] = [
  {
    error: "Enter your name.",
    kind: "name",
    label: "Your name",
    prefill: "Dana Whitfield",
    required: true,
    slug: "name",
    system: true,
  },
  {
    error: "Enter a valid email address.",
    kind: "email",
    label: "Email address",
    lockedOnPrefill: true,
    prefill: "dana@example.com",
    required: true,
    slug: "email",
    system: true,
  },
  {
    kind: "longText",
    label: "Additional notes",
    placeholder: "Anything that will help prepare for the meeting.",
    slug: "notes",
    system: true,
  },
  { kind: "guests", label: "Guests", slug: "guests", system: true },
];

export const fullFields: ProtoField[] = [
  {
    error: "Enter your name.",
    kind: "name",
    label: "Your name",
    prefill: "Dana Whitfield",
    required: true,
    slug: "name",
    system: true,
  },
  {
    error: "Enter a valid email address.",
    kind: "email",
    label: "Email address",
    lockedOnPrefill: true,
    prefill: "dana@example.com",
    required: true,
    slug: "email",
    system: true,
  },
  {
    kind: "phone",
    label: "Phone number",
    placeholder: "+1 555 010 0199",
    required: true,
    slug: "attendeePhoneNumber",
    system: true,
  },
  {
    error: "Choose where to meet.",
    kind: "location",
    label: "Location",
    locationOptions: [
      { label: "Cal Video" },
      { input: "phone", label: "Phone call (we call you)" },
      { input: "address", label: "In person (your address)" },
    ],
    required: true,
    slug: "location",
    system: true,
  },
  {
    error: "Enter your company.",
    kind: "shortText",
    label: "Company",
    prefill: "Northwind Labs",
    required: true,
    slug: "company",
    system: false,
  },
  {
    error: "Choose a team size.",
    kind: "select",
    label: "Team size",
    options: ["1–10", "11–50", "51–200", "More than 200"],
    required: true,
    slug: "team-size",
    system: false,
  },
  {
    kind: "radioGroup",
    label: "What do you need help with?",
    options: [
      "Getting started",
      "Moving from another tool",
      "Pricing",
      "Something else",
    ],
    required: true,
    slug: "help-topic",
    system: false,
  },
  {
    error: "Tell us a little more.",
    kind: "longText",
    label: "Tell us more",
    placeholder: "A sentence or two is plenty.",
    required: true,
    showWhen: { anyOf: ["Something else"], fieldSlug: "help-topic" },
    slug: "tell-us-more",
    system: false,
  },
  {
    kind: "multiSelect",
    label: "Which features interest you?",
    options: ["Scheduling", "Routing", "Workflows", "Insights", "API"],
    slug: "interests",
    system: false,
  },
  {
    kind: "checkboxGroup",
    label: "How did you hear about us?",
    options: ["Search", "A friend or colleague", "Social media", "Newsletter"],
    slug: "heard-from",
    system: false,
  },
  {
    kind: "number",
    label: "Seats needed",
    slug: "seats",
    system: false,
  },
  {
    error: "Enter a full address, including https://.",
    kind: "url",
    label: "Website",
    placeholder: "https://",
    slug: "website",
    system: false,
  },
  {
    kind: "address",
    label: "Office address",
    slug: "office",
    system: false,
  },
  {
    error: "You need to agree before booking.",
    kind: "checkbox",
    label: "I agree to be contacted about my request",
    required: true,
    slug: "consent",
    system: false,
  },
  {
    kind: "longText",
    label: "Additional notes",
    placeholder: "Anything that will help prepare for the meeting.",
    slug: "notes",
    system: true,
  },
  { kind: "guests", label: "Guests", slug: "guests", system: true },
  // The API can return a field it cannot describe. Optional ones are skipped.
  { kind: "unknown", label: "unknown", slug: "unknown", system: false },
];

const teamSizeField: ProtoField = {
  error: "Choose a team size.",
  kind: "select",
  label: "Team size",
  options: ["1–10", "11–50", "51–200", "More than 200"],
  required: true,
  slug: "team-size",
  system: false,
};

// One custom question in a form short enough to stay a single list.
export const shortFields: ProtoField[] = [
  ...simpleFields.slice(0, 2),
  teamSizeField,
  ...simpleFields.slice(2),
];

// The host put a custom question first, so there is nothing to cut before it.
export const customFirstFields: ProtoField[] = [
  teamSizeField,
  ...fullFields.filter((field) => field.slug !== "team-size"),
];

export const variants = [{ key: "A", label: "One list" }] as const;

export type VariantKey = (typeof variants)[number]["key"];

export const scenarios = [
  { key: "full", label: "Every field kind" },
  { key: "simple", label: "No custom questions" },
  { key: "short", label: "Short, one question" },
  { key: "customFirst", label: "Custom question first" },
  { key: "errors", label: "Errors" },
  { key: "prefilled", label: "Prefilled" },
] as const;

export type ScenarioKey = (typeof scenarios)[number]["key"];

export function getScenarioFields(scenario: ScenarioKey): ProtoField[] {
  if (scenario === "simple") {
    return simpleFields;
  }
  if (scenario === "short") {
    return shortFields;
  }
  if (scenario === "customFirst") {
    return customFirstFields;
  }
  return fullFields;
}

export function getInitialValues(
  scenario: ScenarioKey,
  fields: ProtoField[],
): FieldValues {
  if (scenario !== "prefilled") {
    return {};
  }
  const values: FieldValues = {};
  for (const field of fields) {
    if (field.prefill !== undefined) {
      values[field.slug] = field.prefill;
    }
  }
  return values;
}

export function isFieldVisible(field: ProtoField, values: FieldValues) {
  if (field.kind === "unknown") {
    return false;
  }
  if (!field.showWhen) {
    return true;
  }
  const controlling = values[field.showWhen.fieldSlug];
  return (
    typeof controlling === "string" &&
    field.showWhen.anyOf.includes(controlling)
  );
}

export function isFieldEmpty(value: FieldValue | undefined) {
  if (value === undefined || value === false) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}
