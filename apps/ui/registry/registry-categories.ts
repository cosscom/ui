/**
 * Registry Categories Type Definition
 *
 * This file defines all valid categories that can be used in registry items.
 * All categories are treated equally - no distinction between component and tag categories.
 */

// All registry categories in display order
export const registryCategories = [
  // UI components
  "accordion",
  "alert",
  "alert dialog",
  "autocomplete",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "checkbox",
  "checkbox group",
  "collapsible",
  "combobox",
  "composer",
  "command",
  "context menu",
  "date picker",
  "dialog",
  "drawer",
  "dropdown",
  "empty state",
  "field",
  "fieldset",
  "form",
  "frame",
  "group",
  "input",
  "input group",
  "kbd",
  "label",
  "menu",
  "meter",
  "navigation",
  "number field",
  "otp field",
  "pagination",
  "popover",
  "preview card",
  "progress",
  "radio group",
  "scroll area",
  "select",
  "segmented control",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle group",
  "toolbar",
  "tooltip",
  // Features and states
  "async",
  "copy",
  "disabled",
  "error",
  "file",
  "filter",
  "info",
  "loading",
  "multiselect",
  "password",
  "search",
  "sort",
  "success",
  "tag",
  "tanstack",
  "text editor",
  "time",
  "timezone",
  "upload",
  "validation",
  "warning",
  "zod",
] as const;

export type RegistryCategory = (typeof registryCategories)[number];

// Helper function to get category sort order
export function getCategorySortOrder(category: string): number {
  const index = registryCategories.indexOf(category as RegistryCategory);
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

// Helper function to validate if a string is a valid RegistryCategory
export function isValidRegistryCategory(
  category: string,
): category is RegistryCategory {
  return registryCategories.includes(category as RegistryCategory);
}
