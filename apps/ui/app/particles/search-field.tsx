"use client";

import { LabelIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { useContext, useEffect, useMemo, useState } from "react";
import { Index } from "@/registry/__index__";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContext,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxList,
  ComboboxPrimitive,
  ComboboxSeparator,
  ComboboxValue,
} from "@/registry/default/ui/combobox";
import { getCategorySortOrder } from "@/registry/registry-categories";

interface SearchFieldProps {
  selectedItems: { label: string; value: string }[];
  onItemsChange: (items: { label: string; value: string }[]) => void;
  items: { label: string; value: string }[];
}

interface RegistryItem {
  type?: string;
  categories?: string[];
}

// Get all particles (registry:block type) from registry
const particles = Object.values(Index).filter(
  (item: RegistryItem) => item.type === "registry:block",
);

export default function SearchField({
  selectedItems,
  onItemsChange,
  items,
}: SearchFieldProps) {
  const [open, setOpen] = useState(selectedItems.length === 0);

  // Keep popup open when no selection is made
  useEffect(() => {
    if (selectedItems.length === 0) {
      setOpen(true);
    }
  }, [selectedItems.length]);

  const groupedItems = useMemo(() => {
    const selectedValues = selectedItems.map((item) => item.value);

    // Calculate which items would result in particles when combined with selected items
    const availableItems = items.filter((item) => {
      // Skip already selected items
      if (selectedValues.includes(item.value)) {
        return true;
      }

      // Check if adding this category would result in any particles
      const testValues = [...selectedValues, item.value];
      const hasMatches = particles.some((particle: RegistryItem) => {
        const categories = particle.categories ?? [];
        return testValues.every((value) => categories.includes(value));
      });

      return hasMatches;
    });

    // Separate items into enabled and disabled
    const enabled: typeof items = [];
    const disabled: typeof items = [];

    items.forEach((item) => {
      const isSelected = selectedValues.includes(item.value);
      const isAvailable = availableItems.some(
        (available) => available.value === item.value,
      );

      if (isSelected || isAvailable) {
        enabled.push(item);
      } else {
        disabled.push(item);
      }
    });

    // Sort enabled items: selected first, then available, then by custom order
    const sortedEnabled = [...enabled].sort((a, b) => {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);

      // Selected items first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // Then sort by custom category order
      const aOrder = getCategorySortOrder(a.value);
      const bOrder = getCategorySortOrder(b.value);
      return aOrder - bOrder;
    });

    // Sort disabled items by custom category order
    const sortedDisabled = [...disabled].sort((a, b) => {
      const aOrder = getCategorySortOrder(a.value);
      const bOrder = getCategorySortOrder(b.value);
      return aOrder - bOrder;
    });

    // Return groups similar to the grouped example
    const groups: Array<{ type: "enabled" | "disabled"; items: typeof items }> =
      [];

    if (sortedEnabled.length > 0) {
      groups.push({ items: sortedEnabled, type: "enabled" });
    }

    if (sortedDisabled.length > 0) {
      groups.push({ items: sortedDisabled, type: "disabled" });
    }

    return groups;
  }, [selectedItems, items]);

  const handleValueChange = (newItems: { label: string; value: string }[]) => {
    onItemsChange(newItems);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-xl">
      <Combobox
        aria-label="Filter particles"
        autoHighlight
        items={groupedItems}
        multiple
        onOpenChange={setOpen}
        onValueChange={handleValueChange}
        open={open}
        value={selectedItems}
      >
        <ComboboxChips
          className="rounded-xl p-[calc(--spacing(2)-1px)] before:rounded-xl **:data-[slot=combobox-start-addon]:[&_svg]:-me-0.5"
          startAddon={
            <HugeiconsIcon
              className="size-5.5 sm:size-5"
              icon={Search01Icon}
              strokeWidth={2}
            />
          }
        >
          <ComboboxValue>
            {(value: { value: string; label: string }[]) => (
              <>
                {value?.map((item) => (
                  <ComboboxChip aria-label={item.label} key={item.value}>
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        className="opacity-80"
                        icon={LabelIcon}
                        strokeWidth={2}
                      />
                      <span>{item.label}</span>
                    </div>
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  aria-label="Search components"
                  autoFocus
                  size="lg"
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <SearchPopup>
          <ComboboxEmpty>No filters found.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof groupedItems)[number]) => (
              <React.Fragment key={group.type}>
                {group.type === "disabled" && (
                  <ComboboxSeparator className="my-2" />
                )}
                <ComboboxGroup items={group.items}>
                  <ComboboxGroupLabel>
                    {group.type === "enabled"
                      ? "Filter particles"
                      : "No matches"}
                  </ComboboxGroupLabel>
                  <ComboboxCollection>
                    {(item: (typeof group.items)[number]) => (
                      <ComboboxItem
                        disabled={group.type === "disabled"}
                        key={item.value}
                        value={item}
                      >
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon
                            className="opacity-80"
                            icon={LabelIcon}
                            strokeWidth={2}
                          />
                          <span>{item.label}</span>
                        </div>
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              </React.Fragment>
            )}
          </ComboboxList>
        </SearchPopup>
      </Combobox>
    </div>
  );
}

// Keep this page’s search below the field without changing the shared popup.
function SearchPopup({ children }: { children: React.ReactNode }) {
  const { chipsRef } = useContext(ComboboxContext);

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align="start"
        anchor={chipsRef}
        className="z-50 select-none"
        collisionAvoidance={{
          side: "none",
          align: "shift",
          fallbackAxisSide: "none",
        }}
        data-slot="combobox-positioner"
        side="bottom"
        sideOffset={4}
      >
        <span className="relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
          <ComboboxPrimitive.Popup
            className="flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
            data-slot="combobox-popup"
          >
            {children}
          </ComboboxPrimitive.Popup>
        </span>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
