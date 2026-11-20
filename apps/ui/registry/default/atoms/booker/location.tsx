"use client";

import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import type { EventTypeLocationOption } from "@/lib/booker/utils";

type LocationLabels = {
  locationOptions: (count: number) => string;
  selectOnNextStep: string;
};

type LocationProps = {
  locations: EventTypeLocationOption[];
  labels: LocationLabels;
};

const PROVIDER_ICON_MAP: Record<string, string> = {
  "cal-video": "https://app.cal.com/app-store/dailyvideo/icon.svg",
  "daily-video": "https://app.cal.com/app-store/dailyvideo/icon.svg",
  "google-meet": "https://i.cal.com/app-store/googlevideo/logo.webp",
  "huddle01-video": "/app-store/huddle01video/icon.svg",
  "microsoft-teams": "/app-store/office365video/icon.svg",
  conferencing: "external-link",
  jitsi: "/app-store/jitsivideo/icon.svg",
  organizersdefaultapp: "external-link",
  whereby: "/app-store/whereby/icon-dark.svg",
  zoom: "/app-store/zoomvideo/icon.svg",
};

function normalizeIconUrl(value: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `https://app.cal.com${value}`;
  }

  return value;
}

function resolveProviderIcons(provider?: string): string[] {
  if (!provider) {
    return [];
  }

  const normalized = provider.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const appStoreSlugs = new Set<string>([
    normalized,
    normalized.replaceAll("-", ""),
  ]);
  if (normalized.endsWith("-video")) {
    appStoreSlugs.add(normalized.replace(/-video$/, "video"));
  }

  return Array.from(
    new Set([
      PROVIDER_ICON_MAP[normalized],
      ...Array.from(
        appStoreSlugs,
        (slug) => `https://app.cal.com/app-store/${slug}/icon.svg`,
      ),
    ]),
  )
    .filter((url): url is string => Boolean(url))
    .map(normalizeIconUrl);
}

export function LocationIcon({ provider }: { provider?: string }) {
  const iconUrls = useMemo(() => resolveProviderIcons(provider), [provider]);
  const [failedIconUrls, setFailedIconUrls] = useState<Set<string>>(
    () => new Set(),
  );
  const iconUrl =
    iconUrls.find((candidate) => !failedIconUrls.has(candidate)) ?? "";

  if (iconUrl) {
    if (iconUrl === "external-link") {
      return (
        <ExternalLinkIcon
          className="size-4.5 shrink-0 opacity-80 sm:size-4"
          aria-hidden="true"
        />
      );
    }

    return (
      <img
        alt=""
        aria-hidden="true"
        className="size-4.5 shrink-0 sm:size-4"
        onError={() => setFailedIconUrls((prev) => new Set(prev).add(iconUrl))}
        src={iconUrl}
      />
    );
  }

  return (
    <MapPinIcon
      className="size-4.5 shrink-0 opacity-80 sm:size-4"
      aria-hidden="true"
    />
  );
}

export function LocationRow({ label, provider }: EventTypeLocationOption) {
  return (
    <div className="flex items-center gap-2">
      <LocationIcon provider={provider} />
      <span>{label}</span>
    </div>
  );
}

export function getLocationOptionValue(
  location: EventTypeLocationOption,
  index: number,
): string {
  return location.provider || `${location.label}-${index}`;
}

type LocationSelectItem = EventTypeLocationOption & {
  value: string;
};

type LocationPickerProps = {
  locations: EventTypeLocationOption[];
  label: string;
  onValueChange?: (provider: string) => void;
};

function LocationSelectOption({ label, provider }: LocationSelectItem) {
  return (
    <span className="flex items-center gap-2">
      <LocationIcon provider={provider} />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function LocationPicker({
  locations,
  label,
  onValueChange,
}: LocationPickerProps) {
  const items = useMemo(
    (): LocationSelectItem[] =>
      locations.map((location, index) => ({
        ...location,
        value: getLocationOptionValue(location, index),
      })),
    [locations],
  );

  if (items.length <= 1) {
    return null;
  }

  return (
    <Field name="location">
      <FieldLabel>{label}</FieldLabel>
      <Select
        aria-label={label}
        defaultValue={items[0]}
        itemToStringValue={(item) => item.value}
        onValueChange={(item) => {
          if (item) {
            onValueChange?.(item.provider || item.value);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue>
            {(item) => <LocationSelectOption {...item} />}
          </SelectValue>
        </SelectTrigger>
        <SelectPopup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item}>
              <LocationSelectOption {...item} />
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
}

export function Location({ locations, labels }: LocationProps) {
  if (locations.length <= 1) {
    const location = locations[0];
    return location ? <LocationRow {...location} /> : null;
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label={labels.locationOptions(locations.length)}
        className="flex w-fit items-center gap-2 decoration-current/32 decoration-dotted underline-offset-2 hover:text-foreground hover:underline"
        openOnHover
        delay={0}
      >
        <MapPinIcon className="h-lh w-4.5 shrink-0 opacity-80 sm:w-4" />
        <span>{labels.locationOptions(locations.length)}</span>
      </PopoverTrigger>
      <PopoverPopup align="start" side="top" className="*:p-3">
        <PopoverDescription className="mb-2 font-medium text-muted-foreground text-xs">
          {labels.selectOnNextStep}
        </PopoverDescription>
        <ul className="flex flex-col gap-2">
          {locations.map((location, index) => (
            <li
              className="flex items-center gap-2 font-medium text-xs"
              key={`${location.label}-${location.provider}-${index}`}
            >
              <LocationIcon provider={location.provider} />
              <span>{location.label}</span>
            </li>
          ))}
        </ul>
      </PopoverPopup>
    </Popover>
  );
}
