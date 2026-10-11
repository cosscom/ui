import { cn } from "@coss/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircleIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  TextCursorIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import type { ReactNode } from "react";

// ============================================================================
// Base Components
// ============================================================================

function Icon({
  icon: IconComponent,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <IconComponent
      className={cn("size-4 text-muted-foreground/88", className)}
    />
  );
}

function Text({
  className,
  variant = "main",
}: {
  className?: string;
  variant?: "main" | "secondary";
}) {
  const bgColor =
    variant === "main" ? "bg-muted-foreground/40" : "bg-muted-foreground/20";
  return <div className={cn("h-1.5 rounded-full", bgColor, className)} />;
}

function Button({
  variant = "secondary",
  className,
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const height = variant === "primary" ? "h-4" : "h-1.5";
  const bgColor =
    variant === "primary"
      ? "bg-linear-to-b from-(--btn-from) to-(--btn-to)"
      : "bg-muted-foreground/20";
  return <div className={cn(height, "w-7 rounded-sm", bgColor, className)} />;
}

// Standalone Card component for thumbnails - independent from registry Card
function Card({
  children,
  className,
  withGradient = true,
}: {
  children: ReactNode;
  className?: string;
  withGradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-72 flex-col rounded-2xl border not-dark:bg-clip-padding text-card-foreground shadow-md/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_-1px_--theme(--color-white/6%),0_1px_--theme(--color-black/6%)]",
        withGradient
          ? "bg-linear-to-b from-[color-mix(in_srgb,var(--card)_96%,var(--color-white))] to-[color-mix(in_srgb,var(--card)_99%,var(--color-black))] dark:to-[color-mix(in_srgb,var(--card)_98%,var(--color-white))]"
          : "bg-card/99 dark:bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Standalone CardPanel component for thumbnails - independent from registry CardPanel
function CardPanel({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 p-6", className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function CheckboxItem({
  checked = false,
  className,
}: {
  checked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-4 shrink-0 rounded",
          checked
            ? "bg-linear-to-b from-(--btn-from) to-(--btn-to)"
            : "bg-muted-foreground/20",
        )}
      />
      <Text className="w-full" variant="secondary" />
    </div>
  );
}

function RadioItem({
  checked = false,
  className,
}: {
  checked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-4 shrink-0 rounded-full",
          checked
            ? "bg-linear-to-b from-(--btn-from) to-(--btn-to)"
            : "bg-muted-foreground/20",
        )}
      />
      <Text className="w-full" variant="secondary" />
    </div>
  );
}

function FormField({
  labelWidth = "w-16",
  showError = false,
}: {
  labelWidth?: string;
  showError?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Text className={labelWidth} />
      <Card className="[--radius-2xl:10px]" withGradient={false}>
        <CardPanel className="py-3.5" />
      </Card>
      {showError && <Text className="w-[80%]" variant="secondary" />}
    </div>
  );
}

function TableRow({ showCheckbox = true }: { showCheckbox?: boolean }) {
  return (
    <div className="flex items-center gap-2 p-3">
      {showCheckbox && <Text className="size-2.5 rounded-xs" />}
      <Text className="flex-1" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
    </div>
  );
}

function CommandItem() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Text className="w-[65%]" variant="secondary" />
      <Text className="w-4" variant="secondary" />
    </div>
  );
}

// ============================================================================
// Thumbnail Implementations
// ============================================================================

// Accordion
export const accordionThumbnail = (
  <Card className="max-w-50">
    <CardPanel className="divide-y divide-border p-0">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Icon icon={ChevronDownIcon} />
          <Text className="w-[60%]" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Icon className="rotate-180" icon={ChevronDownIcon} />
          <div className="flex flex-1 flex-col gap-2">
            <Text className="w-[50%]" variant="main" />
            <Text className="w-[90%]" variant="secondary" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Icon icon={ChevronDownIcon} />
          <Text className="w-[60%]" />
        </div>
      </div>
    </CardPanel>
  </Card>
);

// Alert
export const alertThumbnail = (
  <Card>
    <CardPanel className="flex items-center gap-2 p-3">
      <Icon icon={AlertCircleIcon} />
      <Text className="w-[70%]" variant="secondary" />
    </CardPanel>
  </Card>
);

// Alert Dialog
export const alertDialogThumbnail = (
  <Card className="max-w-50">
    <CardPanel className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-2">
        <Text className="w-[50%]" variant="main" />
        <Text className="w-[90%]" variant="secondary" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" />
        <Button variant="primary" />
      </div>
    </CardPanel>
  </Card>
);

// Autocomplete
export const autocompleteThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-2">
    <Card className="[--radius-2xl:12px]" withGradient={false}>
      <CardPanel className="flex items-center gap-2 px-4 py-2">
        <Text className="w-[40%]" />
        <Icon icon={TextCursorIcon} />
      </CardPanel>
    </Card>
    <Card className="[--radius-2xl:10px]">
      <CardPanel className="flex flex-col gap-4 p-4">
        <Text variant="secondary" />
        <Text variant="secondary" />
        <Text variant="secondary" />
      </CardPanel>
    </Card>
  </div>
);

// Avatar
export const avatarThumbnail = (
  <Card className="size-12 [--radius-2xl:9999px]">
    <CardPanel className="flex items-center justify-center p-0">
      <div className="flex size-full items-center justify-center rounded-full">
        <Icon icon={UserRoundIcon} />
      </div>
    </CardPanel>
  </Card>
);

// Badge
export const badgeThumbnail = (
  <Card className="max-w-24 [--radius-2xl:9999px]">
    <CardPanel className="flex items-center gap-2 px-2.5 py-2">
      <div className="size-2 rounded-full bg-muted-foreground/88" />
      <Text className="flex-1" />
    </CardPanel>
  </Card>
);

// Breadcrumb
export const breadcrumbThumbnail = (
  <Card>
    <CardPanel className="flex items-center gap-1 p-3">
      <Text className="flex-1" />
      <Icon icon={ChevronRightIcon} />
      <Text className="flex-1" variant="secondary" />
      <Icon icon={ChevronRightIcon} />
      <Text className="flex-1" variant="secondary" />
    </CardPanel>
  </Card>
);

// Button
export const buttonThumbnail = (
  <Card
    className="max-w-24 border-none bg-linear-to-b from-(--btn-from) to-(--btn-to) [--radius-2xl:14px]"
    withGradient={false}
  >
    <CardPanel className="px-6 py-4">
      <Text className="bg-primary-foreground/40" />
    </CardPanel>
  </Card>
);

// Calendar
export const calendarThumbnail = (
  <Card className="max-w-36 [--radius-2xl:14px]">
    <CardPanel className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Icon icon={ChevronLeftIcon} />
        <Text className="w-[60%]" variant="secondary" />
        <Icon icon={ChevronRightIcon} />
      </div>
      <div className="flex items-center gap-2">
        <Text className="flex-1" variant="secondary" />
        <Text className="flex-1" variant="secondary" />
        <Text className="flex-1" variant="main" />
        <Text className="flex-1 bg-transparent" variant="main" />
        <Text className="flex-1" variant="main" />
      </div>
      <div className="flex items-center gap-2">
        <Text className="flex-1" variant="main" />
        <Text className="flex-1 bg-transparent" variant="main" />
        <Text className="flex-1" variant="main" />
        <Text className="flex-1" variant="main" />
        <Text className="flex-1" variant="main" />
      </div>
      <div className="flex items-center gap-2">
        <Text className="flex-1 bg-transparent" variant="main" />
        <Text className="flex-1" variant="main" />
        <Text className="flex-1 bg-primary" variant="main" />
        <Text className="flex-1" variant="main" />
        <Text className="flex-1 bg-transparent" variant="main" />
      </div>
      <div className="flex items-center gap-2">
        <Text className="flex-1" variant="main" />
        <Text className="flex-1" variant="main" />
        <Text className="flex-1 bg-transparent" variant="main" />
        <Text className="flex-1" variant="secondary" />
        <Text className="flex-1" variant="secondary" />
      </div>
    </CardPanel>
  </Card>
);

// Card
export const cardThumbnail = (
  <Card className="max-w-36 [--radius-2xl:14px]">
    <CardPanel className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <Text className="w-[60%]" variant="main" />
        <Text className="w-[90%]" variant="secondary" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 rounded-sm bg-muted-foreground/8" />
        <div className="h-4 rounded-sm bg-muted-foreground/8" />
        <Button className="w-full rounded-sm" variant="primary" />
      </div>
    </CardPanel>
  </Card>
);

// Checkbox
export const checkboxThumbnail = (
  <div className="flex max-w-28 flex-1 flex-col gap-3">
    <CheckboxItem />
    <CheckboxItem checked />
  </div>
);

// Checkbox Group
export const checkboxGroupThumbnail = (
  <div className="flex max-w-28 flex-1 flex-col gap-3">
    <CheckboxItem checked />
    <CheckboxItem className="ps-4" />
    <CheckboxItem checked className="ps-4" />
    <CheckboxItem />
  </div>
);

// Collapsible
export const collapsibleThumbnail = (
  <Card>
    <CardPanel className="divide-y divide-border p-0">
      <div className="flex items-center justify-between px-4 py-3">
        <Text className="w-[60%]" />
        <Icon icon={ChevronDownIcon} />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Text className="w-[80%]" variant="secondary" />
        <Text className="w-[70%]" variant="secondary" />
      </div>
    </CardPanel>
  </Card>
);

// Combobox
export const comboboxThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="flex items-center gap-2 px-3 py-[calc(--spacing(2.5)-1px)]">
      <div className="flex h-5 items-center gap-1 rounded-sm bg-muted-foreground/8 py-0.5 ps-2 pe-1">
        <Text className="w-6" />
        <Icon icon={XIcon} />
      </div>
      <div className="flex h-5 items-center gap-1 rounded-sm bg-muted-foreground/8 py-0.5 ps-2 pe-1">
        <Text className="w-6" />
        <Icon icon={XIcon} />
      </div>
    </CardPanel>
  </Card>
);

// Command
export const commandThumbnail = (
  <Card className="max-w-50">
    <CardPanel className="divide-y divide-border p-0">
      <div className="flex items-center gap-2 px-4 py-3">
        <Icon icon={SearchIcon} />
        <Text className="w-[40%]" />
      </div>
      <div className="flex flex-col gap-4 p-4">
        <CommandItem />
        <CommandItem />
        <CommandItem />
      </div>
    </CardPanel>
  </Card>
);

// Date Picker
export const datePickerThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="flex items-center gap-2 p-3">
      <Icon icon={CalendarIcon} />
      <Text className="w-[60%]" />
    </CardPanel>
  </Card>
);

// Drawer
export const drawerThumbnail = (
  <div className="flex h-full w-full flex-1 flex-col justify-end gap-2">
    <div className="flex-1 rounded-xl border border-input border-dashed" />
    <Card className="max-w-none shrink-0 [--radius-2xl:14px]">
      <CardPanel className="pt-1 pb-12">
        <div className="flex justify-center py-2">
          <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
        </div>
      </CardPanel>
    </Card>
  </div>
);

// Dialog
export const dialogThumbnail = (
  <Card className="max-w-36 [--radius-2xl:14px]">
    <CardPanel className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <Text className="w-[60%]" variant="main" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 rounded-sm bg-muted-foreground/8" />
        <div className="h-4 rounded-sm bg-muted-foreground/8" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" />
        <Button variant="primary" />
      </div>
    </CardPanel>
  </Card>
);

// Empty
export const emptyThumbnail = (
  <Card className="border-input border-dashed bg-none shadow-none before:hidden">
    <CardPanel className="flex flex-col items-center gap-2">
      <div className="size-8 rounded-full bg-muted-foreground/20" />
      <Text className="w-[60%]" />
      <Text className="w-[80%]" variant="secondary" />
    </CardPanel>
  </Card>
);

// Field
export const fieldThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-3">
    <FormField showError />
  </div>
);

// Fieldset
export const fieldsetThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-4">
    <FormField />
    <FormField />
  </div>
);

// Form
export const formThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-4">
    <FormField />
    <Card
      className="border-none bg-linear-to-b from-(--btn-from) to-(--btn-to) [--radius-2xl:10px]"
      withGradient={false}
    >
      <CardPanel className="py-3.5" />
    </Card>
  </div>
);

// Frame
export const frameThumbnail = (
  <div className="flex-1 rounded-[calc(var(--radius-2xl)+2px)] bg-muted/72 p-1">
    <div className="flex flex-col gap-2 p-4">
      <Text className="w-[70%]" />
    </div>
    <Card className="max-w-none">
      <CardPanel className="p-5">
        <div className="flex flex-col gap-2">
          <Text className="w-[70%]" />
          <Text className="w-[90%]" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  </div>
);

// Group
export const groupThumbnail = (
  <Card className="max-w-48 flex-row divide-x [--radius-2xl:14px]">
    <CardPanel className="px-6 py-4">
      <Text />
    </CardPanel>
    <CardPanel className="px-6 py-4">
      <Text />
    </CardPanel>
  </Card>
);

// Input
export const inputThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="px-6 py-4">
      <Text className="w-[60%]" />
    </CardPanel>
  </Card>
);

// Input Group
export const inputGroupThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="flex gap-2 p-0">
      <div className="flex flex-1 items-center gap-2 py-2.5 ps-4">
        <Icon icon={SearchIcon} />
        <Text className="w-[60%]" />
      </div>
      <div className="flex items-center py-2.5 pe-4">
        <div className="size-4 shrink-0 rounded bg-muted-foreground/20" />
      </div>
    </CardPanel>
  </Card>
);

// Input OTP
export const inputOtpThumbnail = (
  <div className="flex max-w-50 flex-1 items-center gap-2">
    <Card className="size-10 [--radius-2xl:12px]" withGradient={false}>
      <CardPanel className="flex items-center justify-center p-0">
        <Text className="size-1.5" />
      </CardPanel>
    </Card>
    <Card className="size-10 [--radius-2xl:12px]" withGradient={false}>
      <CardPanel className="flex items-center justify-center p-0">
        <Text className="size-1.5" />
      </CardPanel>
    </Card>
    <Card className="size-10 [--radius-2xl:12px]" withGradient={false}>
      <CardPanel className="flex items-center justify-center p-0">
        <Text className="size-1.5" />
      </CardPanel>
    </Card>
    <Card className="size-10 [--radius-2xl:12px]" withGradient={false}>
      <CardPanel className="flex items-center justify-center p-0">
        <Icon icon={TextCursorIcon} />
      </CardPanel>
    </Card>
  </div>
);

// Kbd
export const kbdThumbnail = (
  <div className="flex items-center justify-center gap-2">
    <Card className="size-10 [--radius-2xl:10px]">
      <CardPanel className="flex items-center justify-center p-0 text-muted-foreground/88 leading-none">
        ⌘
      </CardPanel>
    </Card>
    <Card className="size-10 [--radius-2xl:10px]">
      <CardPanel className="flex items-center justify-center p-0 text-muted-foreground/88 leading-none">
        K
      </CardPanel>
    </Card>
  </div>
);

// Label
export const labelThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-3">
    <Text className="w-16 bg-primary" />
    <Card className="[--radius-2xl:10px]" withGradient={false}>
      <CardPanel className="py-3.5" />
    </Card>
  </div>
);

// Context Menu
export const contextMenuThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col">
    <Card className="border-input border-dashed bg-none shadow-none [--radius-2xl:10px] before:hidden">
      <CardPanel className="min-h-20" />
    </Card>
    <Card className="ms-auto -mt-3 w-fit [--radius-2xl:10px]">
      <CardPanel className="flex flex-col gap-3 p-3">
        <Text className="w-16" variant="secondary" />
        <Text className="w-16" variant="secondary" />
        <Text className="w-16" variant="secondary" />
      </CardPanel>
    </Card>
  </div>
);

// Menu
export const menuThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col items-end gap-2">
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="flex items-center gap-2 p-2">
        <Icon icon={EllipsisIcon} />
      </CardPanel>
    </Card>
    <Card className="[--radius-2xl:10px]">
      <CardPanel className="flex flex-col gap-4 p-4">
        <div className="me-6">
          <Text className="w-full" variant="secondary" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Text variant="secondary" />
          </div>
          <Icon className="-m-1" icon={ChevronRightIcon} />
        </div>
        <div className="me-6">
          <Text className="w-full" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  </div>
);

// Meter
export const meterThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-2">
    <div className="flex items-center justify-between">
      <Text className="w-[50%]" />
      <Text className="w-8" />
    </div>
    <div className="h-2 w-full rounded-full bg-muted-foreground/20">
      <div className="h-2 w-[65%] rounded-s-full bg-linear-to-b from-(--btn-from) to-(--btn-to)" />
    </div>
  </div>
);

// Number Field
export const numberFieldThumbnail = (
  <Card className="[--radius-2xl:14px]">
    <CardPanel className="flex items-center gap-2 px-4 py-2.5">
      <Icon className="shrink-0" icon={MinusIcon} />
      <div className="flex flex-1 justify-center">
        <Text className="w-12" />
      </div>
      <Icon className="shrink-0" icon={PlusIcon} />
    </CardPanel>
  </Card>
);

// Pagination
export const paginationThumbnail = (
  <div className="flex flex-1 items-center gap-4">
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="flex items-center gap-2 p-2">
        <Icon icon={ChevronLeftIcon} />
      </CardPanel>
    </Card>
    <div className="flex flex-1 gap-2">
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
    </div>
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="flex items-center gap-2 p-2">
        <Icon icon={ChevronRightIcon} />
      </CardPanel>
    </Card>
  </div>
);

// Popover
export const popoverThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col items-center gap-2">
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="flex items-center gap-2 px-4 py-3">
        <Text className="w-12" variant="main" />
      </CardPanel>
    </Card>
    <Card className="[--radius-2xl:10px]">
      <CardPanel className="flex flex-col gap-3 p-4">
        <Text className="w-[70%]" variant="main" />
        <div className="flex flex-col gap-1.5">
          <Text className="w-[80%]" variant="secondary" />
          <Text className="w-[60%]" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  </div>
);

// Preview Card
export const previewCardThumbnail = (
  <Card className="max-w-50">
    <CardPanel className="flex items-center gap-3 p-4">
      <div className="size-9 shrink-0 rounded-full bg-muted-foreground/20" />
      <div className="flex flex-1 flex-col gap-2">
        <Text className="w-[70%]" variant="main" />
        <Text variant="secondary" />
        <Text className="w-[90%]" variant="secondary" />
      </div>
    </CardPanel>
  </Card>
);

// Progress
export const progressThumbnail = (
  <div className="flex max-w-50 flex-1 flex-col gap-2">
    <div className="h-2 w-full rounded-full bg-muted-foreground/20">
      <div className="h-2 w-[45%] rounded-s-full bg-linear-to-b from-(--btn-from) to-(--btn-to)" />
    </div>
  </div>
);

// Radio Group
export const radioGroupThumbnail = (
  <div className="flex max-w-28 flex-1 flex-col gap-3">
    <RadioItem />
    <RadioItem checked />
  </div>
);

// Scroll Area
export const scrollAreaThumbnail = (
  <Card className="max-w-36 [--radius-2xl:14px]">
    <CardPanel className="relative p-0">
      <div className="flex flex-col gap-2 p-3">
        <Text className="w-[80%]" variant="secondary" />
        <Text className="w-[90%]" variant="secondary" />
        <Text className="w-[70%]" variant="secondary" />
        <Text className="w-[85%]" variant="secondary" />
        <Text className="w-[90%]" variant="secondary" />
        <Text className="w-[80%]" variant="secondary" />
      </div>
      <div className="absolute top-2 right-1 h-8 w-1 rounded-full bg-muted-foreground/40" />
    </CardPanel>
  </Card>
);

// Select
export const selectThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="flex gap-2 p-0">
      <div className="flex flex-1 items-center justify-between gap-2 py-2.5 ps-4 pe-2.5">
        <Text className="w-[60%]" />
        <Icon icon={ChevronDownIcon} />
      </div>
    </CardPanel>
  </Card>
);

// Separator
export const separatorThumbnail = (
  <div className="max-w-50 flex-1 divide-y">
    <div className="flex flex-col gap-2 py-3">
      <Text className="w-[60%]" />
      <Text variant="secondary" />
    </div>
    <div className="flex items-center gap-2 divide-x py-3">
      <div className="-mx-2 flex-1 px-2 py-1">
        <Text variant="secondary" />
      </div>
      <div className="flex-1 px-2 py-1">
        <Text variant="secondary" />
      </div>
      <div className="-mx-2 flex-1 px-2 py-1">
        <Text variant="secondary" />
      </div>
      <div className="flex-1 px-2 py-1">
        <Text variant="secondary" />
      </div>
    </div>
  </div>
);

// Sheet
export const sheetThumbnail = (
  <div className="flex h-full flex-1 gap-2">
    <div className="flex-1 rounded-xl border border-input border-dashed" />
    <Card className="h-full max-w-1/3 [--radius-2xl:14px]">
      <CardPanel className="flex flex-col gap-4 p-3">
        <div className="flex flex-1 flex-col gap-2">
          <Text className="w-[60%]" variant="main" />
          <Text variant="secondary" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="primary" />
        </div>
      </CardPanel>
    </Card>
  </div>
);

// Skeleton
export const skeletonThumbnail = (
  <div className="mask-[linear-gradient(100deg,black_0%,rgba(0,0,0,0.2)_20%,rgba(0,0,0,0.2)_80%,rgba(0,0,0,0.6)_100%)] flex max-w-50 flex-1 items-center gap-3">
    <div className="size-8 rounded-full bg-muted-foreground/20" />
    <div className="flex flex-1 flex-col gap-2">
      <Text className="w-full" variant="secondary" />
      <Text className="w-full" variant="secondary" />
    </div>
  </div>
);

// Slider
export const sliderThumbnail = (
  <div className="flex w-full max-w-50 items-center gap-1">
    <Text
      className="w-[35%] bg-linear-to-b from-(--btn-from) to-(--btn-to)"
      variant="secondary"
    />
    <div className="size-4 rounded-full bg-linear-to-b from-(--btn-from) to-(--btn-to)" />
    <Text className="flex-1" variant="secondary" />
  </div>
);

// Spinner
export const spinnerThumbnail = (
  <div className="size-8 rotate-45 rounded-full border-3 border-muted-foreground/20 border-t-primary" />
);

// Switch
export const switchThumbnail = (
  <div className="h-6 w-10 rounded-full bg-muted-foreground/20 p-0.5">
    <div className="size-5 rounded-full bg-linear-to-b from-card to-card/90 shadow-xs/5 dark:from-background/90 dark:to-background" />
  </div>
);

// Table
export const tableThumbnail = (
  <Card>
    <CardPanel className="p-0">
      <div className="divide-y divide-border">
        <TableRow />
        <TableRow />
        <TableRow />
      </div>
    </CardPanel>
  </Card>
);

// Tabs
const segmentedControlVisual = (
  <div className="flex rounded-lg bg-muted-foreground/12 p-0.5">
    <div className="rounded-[calc(var(--radius-lg)-1px)] bg-linear-to-b from-card to-card/90 p-3 shadow-xs/5 dark:from-background/90 dark:to-background">
      <Text className="w-6 bg-primary" />
    </div>
    <div className="rounded-[calc(var(--radius-lg)-1px)] p-3">
      <Text className="w-6" variant="secondary" />
    </div>
    <div className="rounded-[calc(var(--radius-lg)-1px)] p-3">
      <Text className="w-6" variant="secondary" />
    </div>
  </div>
);

// Segmented Control
export const segmentedControlThumbnail = (
  <div className="max-w-50">{segmentedControlVisual}</div>
);

// Tabs
export const tabsThumbnail = (
  <div className="flex max-w-50 flex-col gap-4">
    {segmentedControlVisual}
    <div className="flex flex-col gap-2">
      <Text className="w-[70%]" />
      <Text variant="secondary" />
    </div>
  </div>
);

// Composer
export const composerThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="flex flex-col px-4 py-3">
      <Text className="w-[60%]" />
      <div className="mt-4 flex justify-end">
        <div className="size-6 rounded-md bg-linear-to-b from-(--btn-from) to-(--btn-to)" />
      </div>
    </CardPanel>
  </Card>
);

// Textarea
export const textareaThumbnail = (
  <Card className="[--radius-2xl:14px]" withGradient={false}>
    <CardPanel className="flex flex-col gap-2 px-6 py-4">
      <Text className="w-[60%]" />
      <Text className="opacity-0" />
      <Text className="opacity-0" />
    </CardPanel>
  </Card>
);

// Toast
export const toastThumbnail = (
  <div className="relative flex flex-1 justify-center">
    <Card className="absolute -top-6 scale-80">
      <CardPanel className="flex items-center gap-2 p-3" />
    </Card>
    <Card className="absolute -top-3 scale-90">
      <CardPanel className="flex items-center gap-2 p-3" />
    </Card>
    <Card>
      <CardPanel className="flex items-start gap-2 p-3">
        <Icon icon={AlertCircleIcon} />
        <div className="flex flex-1 flex-col gap-2">
          <Text className="w-[40%]" />
          <Text className="w-[70%]" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  </div>
);

// Toggle
export const toggleThumbnail = (
  <div className="flex flex-1 flex-col items-center justify-center gap-2">
    <Card className="max-w-12 [--radius-2xl:14px]">
      <CardPanel className="rounded-[inherit] p-4">
        <Text />
      </CardPanel>
    </Card>
    <Card className="max-w-12 shadow-none [--radius-2xl:14px] before:hidden">
      <CardPanel className="rounded-[inherit] bg-muted-foreground/8 p-4">
        <Text className="bg-primary" />
      </CardPanel>
    </Card>
  </div>
);

// Toggle Group
export const toggleGroupThumbnail = (
  <Card className="w-auto flex-row divide-x [--radius-2xl:14px]">
    <CardPanel className="bg-clip-padding p-4">
      <Text className="w-4" />
    </CardPanel>
    <CardPanel className="bg-muted-foreground/8 bg-clip-padding p-4">
      <Text className="w-4 bg-foreground" />
    </CardPanel>
    <CardPanel className="bg-clip-padding p-4">
      <Text className="w-4" />
    </CardPanel>
  </Card>
);

// Toolbar
export const toolbarThumbnail = (
  <div className="flex items-center gap-1 rounded-xl border p-1">
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="p-3.5">
        <Text className="w-4" />
      </CardPanel>
    </Card>
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="p-3.5">
        <Text className="w-4" />
      </CardPanel>
    </Card>
    <Card className="w-fit [--radius-2xl:12px]">
      <CardPanel className="p-3.5">
        <Text className="w-4" />
      </CardPanel>
    </Card>
  </div>
);

// Tooltip
export const tooltipThumbnail = (
  <div className="flex max-w-32 flex-1 flex-col items-center gap-2">
    <Card className="[--radius-2xl:10px]">
      <CardPanel className="p-4">
        <Text />
      </CardPanel>
    </Card>
    <Icon icon={InfoIcon} />
  </div>
);

// ============================================================================
// Category Thumbnails Map
// ============================================================================

/**
 * Map of category slugs to their thumbnail components.
 * Add new thumbnails here as they are created.
 */
export const categoryThumbnails: Record<string, ReactNode> = {
  accordion: accordionThumbnail,
  alert: alertThumbnail,
  "alert-dialog": alertDialogThumbnail,
  autocomplete: autocompleteThumbnail,
  avatar: avatarThumbnail,
  badge: badgeThumbnail,
  breadcrumb: breadcrumbThumbnail,
  button: buttonThumbnail,
  calendar: calendarThumbnail,
  card: cardThumbnail,
  checkbox: checkboxThumbnail,
  "checkbox-group": checkboxGroupThumbnail,
  collapsible: collapsibleThumbnail,
  combobox: comboboxThumbnail,
  composer: composerThumbnail,
  command: commandThumbnail,
  "context-menu": contextMenuThumbnail,
  "date-picker": datePickerThumbnail,
  dialog: dialogThumbnail,
  drawer: drawerThumbnail,
  empty: emptyThumbnail,
  field: fieldThumbnail,
  fieldset: fieldsetThumbnail,
  form: formThumbnail,
  frame: frameThumbnail,
  group: groupThumbnail,
  input: inputThumbnail,
  "otp-field": inputOtpThumbnail,
  "input-group": inputGroupThumbnail,
  kbd: kbdThumbnail,
  label: labelThumbnail,
  menu: menuThumbnail,
  meter: meterThumbnail,
  "number-field": numberFieldThumbnail,
  pagination: paginationThumbnail,
  popover: popoverThumbnail,
  "preview-card": previewCardThumbnail,
  progress: progressThumbnail,
  "radio-group": radioGroupThumbnail,
  "scroll-area": scrollAreaThumbnail,
  select: selectThumbnail,
  "segmented-control": segmentedControlThumbnail,
  separator: separatorThumbnail,
  sheet: sheetThumbnail,
  skeleton: skeletonThumbnail,
  slider: sliderThumbnail,
  spinner: spinnerThumbnail,
  switch: switchThumbnail,
  table: tableThumbnail,
  tabs: tabsThumbnail,
  textarea: textareaThumbnail,
  toast: toastThumbnail,
  toggle: toggleThumbnail,
  "toggle-group": toggleGroupThumbnail,
  toolbar: toolbarThumbnail,
  tooltip: tooltipThumbnail,
};

/**
 * Get the thumbnail for a category by slug.
 * Returns undefined if no thumbnail exists for the given slug.
 */
export function getCategoryThumbnail(slug: string): ReactNode | undefined {
  return categoryThumbnails[slug];
}
