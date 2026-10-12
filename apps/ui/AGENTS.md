# Particle Component Development Guide for @coss/ui

This guide provides comprehensive instructions for creating new particle components that match the existing library's patterns and best practices. Use this when creating equivalents of origin components or building new particles from scratch.

---

## 1. File Structure and Naming

**Location:** `apps/ui/registry/default/particles/`

**Naming Convention:** `p-{component}-{N}.tsx`
- `{component}`: The primary component name (e.g., `button`, `input`, `alert-dialog`, `input-group`, `otp-field`)
- `{N}`: Sequential number within the category (e.g., `1`, `2`, `3`)
- Use hyphens for multi-word components (e.g., `alert-dialog`, `input-group`, `number-field`)

**Examples:**
- `p-button-1.tsx` (first button particle)
- `p-input-group-15.tsx` (fifteenth input group particle)
- `p-alert-dialog-2.tsx` (second alert dialog particle)

**Important:**
- Always name the default export function `Particle` (not `ParticleButton8` or similar)
- If a particle uses multiple UI primitives, choose the primary category for the file name
- Keep files minimal and focused on demonstrating one pattern or feature

---

## 2. Function Signature

**Always use this exact signature:**

```tsx
export default function Particle() {
  return (
    // JSX here
  );
}
```

**Never:**
- Use named exports like `export function ParticleButton8()`
- Add parameters to the Particle function
- Export multiple components from one file

---

## 3. "use client" Directive

**Only add `"use client";` at the top when the particle uses:**

- React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, etc.)
- Event handlers that modify state (`onClick`, `onChange`, etc. that call `setState`)
- Browser APIs (`window`, `document`, `localStorage`, etc.)
- Context providers/consumers that require client-side rendering
- Form submissions or interactive state management

**Do NOT add `"use client"` for:**
- Stateless components
- Components that only render UI without interactivity
- Components using controlled props (state managed externally)
- Simple compositions of UI primitives

**Examples:**

```tsx
// ✅ Needs "use client" - uses useState
"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [loading, setLoading] = useState(false);
  return <Button onClick={() => setLoading(true)}>Click</Button>;
}
```

```tsx
// ✅ Does NOT need "use client" - stateless
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  return <Button>Click me</Button>;
}
```

---

## 4. Import Patterns

### Icons

**Import specific icons from `lucide-react`:**

```tsx
import { ChevronRightIcon, PlusIcon, XIcon } from "lucide-react";
```

**Never:**
- Import entire icon libraries (`import * from "lucide-react"`)
- Use icon components from other libraries (only use `lucide-react`)

### Components

**Import from `@/registry/default/ui/{component}`:**

```tsx
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import {
  Dialog,
  DialogPopup,
  DialogTrigger,
  DialogTitle,
} from "@/registry/default/ui/dialog";
```

**Important:** Always use the `@/registry/default/ui/` path, never `@coss/ui/components/` in particles.

### React

**Always use named imports for React hooks:**

```tsx
import { useState, useEffect, useId, useRef, useCallback, useMemo } from "react";
```

**Then use hooks directly:**

```tsx
const id = useId();
const [state, setState] = useState(false);
const ref = useRef(null);
```

**Never:**
- Import React namespace (`import * as React`) - always use named imports
- Import React for stateless components (components without hooks or state)

---

## 5. Icon Handling and Accessibility

### Icon Sizing

**Never use numeric `size` props on icons:**

```tsx
// ❌ Never do this
<Icon size={16} />
<Icon size={20} />
```

**Icons use default sizing from their parent context (Button, Badge, etc.), or use Tailwind classes when explicit sizing is needed:**

```tsx
// ✅ Default sizing (no size prop needed)
<Button>
  <PlusIcon aria-hidden="true" />
  Add Item
</Button>

// ✅ Explicit sizing with Tailwind classes (when needed)
<EllipsisIcon className="size-4" />
<UsersRoundIcon className="size-3 shrink-0" />
<ChevronDownIcon className="size-4" />
```

**Common Tailwind size classes for icons:**
- `size-3` - Small icons (12px)
- `size-4` - Default icon size (16px) - most common
- `size-3.5` - Between small and default (14px)

**Components with and without built-in icon sizing:**

Some components have built-in icon sizing via CSS selectors like `[&_svg:not([class*='size-'])]:size-4`. For components that don't have this (e.g., `BreadcrumbLink`), you must explicitly set the icon size using a `size-*` class:

```tsx
// ✅ Component with built-in icon sizing (e.g., Button) - no class needed
<Button size="icon-sm">
  <PlusIcon aria-hidden="true" />
</Button>

// ✅ Component without built-in icon sizing - add size class
<BreadcrumbLink aria-label="Home" render={<Link href="/" />}>
  <HomeIcon aria-hidden="true" className="size-4" />
</BreadcrumbLink>
```

### Icon Opacity Patterns

**Icons inside Buttons:**
- **Do NOT add opacity classes to icons inside buttons** - the Button component automatically handles icon opacity
- For decorative icons in buttons with text, use `aria-hidden="true"` without any opacity class
- For icon-only buttons, use `aria-label` on the button, `aria-hidden="true"` on the icon

```tsx
// ✅ Icon-only button (no opacity needed)
<Button aria-label="Close" size="icon" variant="ghost">
  <XIcon aria-hidden="true" />
</Button>

// ✅ Button with icon and text (no opacity needed)
<Button>
  <PlusIcon aria-hidden="true" />
  Add Item
</Button>

// ❌ Don't add opacity to icons in buttons
<Button>
  <PlusIcon aria-hidden="true" className="opacity-60" />
  Add Item
</Button>
```

**Icons inside Badges:**
- Icons in badges are decorative (the text label provides the meaning)
- Use `aria-hidden="true"` for decorative icons

```tsx
// ✅ Badge with icon
<Badge variant="outline">
  <CheckIcon aria-hidden="true" />
  Verified
</Badge>
```

**Icons inside Input Groups:**
- Icons in `InputGroupAddon` are decorative (the input's aria-label or placeholder provides meaning)
- Use `aria-hidden="true"` for decorative icons

```tsx
// ✅ Input group with icon
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Search" type="search" />
  <InputGroupAddon>
    <SearchIcon aria-hidden="true" />
  </InputGroupAddon>
</InputGroup>
```

**InputGroupAddon DOM Order:**

When using `InputGroupAddon`, it must always come **after** an `InputGroupInput` or `InputGroupTextarea` in the DOM order. The addon's `onMouseDown` handler uses `querySelector` to find the input/textarea element to focus, so if the addon appears before the input element, it won't be able to find it.

```tsx
// ✅ Correct order
<InputGroup>
  <InputGroupTextarea placeholder="Enter code..." />
  <InputGroupAddon align="block-end">
    <Button>Submit</Button>
  </InputGroupAddon>
</InputGroup>

// ❌ Incorrect - addon won't find the textarea
<InputGroup>
  <InputGroupAddon align="block-start">
    <Button>Submit</Button>
  </InputGroupAddon>
  <InputGroupTextarea placeholder="Enter code..." />
</InputGroup>
```

Note: The `align` prop controls visual positioning (e.g., `block-start` renders at top, `block-end` at bottom), but the DOM order must still have the input/textarea first for the focus behavior to work.

**Icons inside Alerts:**
- Icons in alerts are semantic (they convey the alert type/severity)
- Do NOT use `aria-hidden` - screen readers should announce the icon's meaning

```tsx
// ✅ Alert with icon (semantic, no aria-hidden)
<Alert>
  <InfoIcon />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Description here.</AlertDescription>
</Alert>
```

**Icons inside Menu Items:**
- Icons in menu items are decorative (the text label provides the meaning)
- Use `aria-hidden="true"` for decorative icons

```tsx
// ✅ Menu item with icon
<MenuItem>
  <EditIcon aria-hidden="true" />
  Edit
</MenuItem>
```

**Icons inside Command/Input with decorative overlays:**
- For decorative icons positioned absolutely (like search icons in inputs), use `opacity-80` and `aria-hidden="true"`

```tsx
// ✅ Decorative icon overlay
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-3 opacity-80"
>
  <SearchIcon />
</div>
```

### aria-label Usage

**Use `aria-label` when:**
- An interactive element has no visible text label (icon-only buttons, icon-only toggles)
- An input has no visible label
- The element's purpose isn't clear from visual context alone

```tsx
// ✅ Icon-only button
<Button aria-label="Close" size="icon" variant="ghost">
  <XIcon aria-hidden="true" />
</Button>

// ✅ Input without visible label
<InputGroupInput aria-label="Search items" placeholder="Search…" type="search" />

// ✅ Toggle without visible label
<Toggle aria-label="Toggle bold" value="bold">
  <BoldIcon />
</Toggle>
```

**Do NOT use `aria-label` when:**
- The element has visible text that describes its purpose
- The element is decorative (use `aria-hidden="true"` instead)

**Prefer `aria-label` over `sr-only` text:**

For consistency, always prefer `aria-label` over `sr-only` text for providing accessible names to icon-only elements:

```tsx
// ✅ Correct - use aria-label
<BreadcrumbLink aria-label="Home" render={<Link href="/" />}>
  <HomeIcon aria-hidden="true" className="size-4" />
</BreadcrumbLink>

// ❌ Incorrect - avoid sr-only text
<BreadcrumbLink render={<Link href="/" />}>
  <HomeIcon aria-hidden="true" />
  <span className="sr-only">Home</span>
</BreadcrumbLink>
```

### aria-hidden Usage

**Use `aria-hidden="true"` when:**
- An icon is decorative and doesn't add semantic meaning
- The icon is redundant with visible text or labels
- The icon is purely visual decoration
- **Icon-only buttons**: Always use `aria-hidden="true"` on the icon when the button has `aria-label`
- **Buttons with text + icon**: Use `aria-hidden="true"` on decorative icons (most common case)
- **Badges with icons**: Use `aria-hidden="true"` (text provides meaning)
- **Input groups**: Use `aria-hidden="true"` on icons in `InputGroupAddon` (input label/placeholder provides meaning)
- **Menu items**: Use `aria-hidden="true"` on icons (text provides meaning)

```tsx
// ✅ Icon-only button (button has aria-label, icon is decorative)
<Button aria-label="Close" size="icon" variant="ghost">
  <XIcon aria-hidden="true" />
</Button>

// ✅ Button with text + decorative icon
<Button>
  <PlusIcon aria-hidden="true" />
  Add Item
</Button>

// ✅ Badge with decorative icon
<Badge>
  <CheckIcon aria-hidden="true" />
  Verified
</Badge>
```

**Do NOT use `aria-hidden` when:**
- The icon conveys important semantic information (e.g., alert icons that indicate severity/type)
- The icon is the only content AND the parent doesn't have `aria-label` (use `aria-label` on parent instead)

---

## 6. Accessibility Best Practices

### Inputs Without Visible Labels

**Always use `aria-label` for inputs without visible labels:**

```tsx
<InputGroupInput
  aria-label="Subscribe to our newsletter"
  placeholder="Your email"
  type="email"
/>
```

### Input Type Attribute

**Always specify the `type` attribute explicitly on Input and InputGroupInput components:**

```tsx
// ✅ Always specify type
<Input type="text" placeholder="Enter name" />
<Input type="email" placeholder="your@email.com" />
<Input type="password" placeholder="Enter password" />
<Input type="search" placeholder="Search…" />
<Input type="file" />

// ❌ Never omit type
<Input placeholder="Enter text" />
```

**Common types:**
- `type="text"` - Default text input (always specify explicitly)
- `type="email"` - Email input with validation
- `type="password"` - Password input (hidden characters)
- `type="search"` - Search input
- `type="file"` - File upload input

**Important:** Even for text inputs, always specify `type="text"` explicitly for clarity and consistency.

### Labeling Checkboxes, Radio Groups, and Switches

**Pattern 1: Simple label (checkbox/radio/switch directly with label text)**

Wrap both the control and label text in a `<Label>` component:

```tsx
// ✅ Checkbox
<Label>
  <Checkbox />
  Accept terms and conditions
</Label>

// ✅ Radio
<Label>
  <Radio value="next" />
  Next.js
</Label>

// ✅ Switch
<Label>
  <Switch />
  Marketing emails
</Label>
```

**Pattern 2: Label with additional content (description text)**

When you have additional content like description text, use `id` and `htmlFor`:

```tsx
import { useId } from "react";

export default function Particle() {
  const id = useId();
  
  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} />
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>Accept terms and conditions</Label>
        <p className="text-muted-foreground text-xs">
          By clicking this checkbox, you agree to the terms.
        </p>
      </div>
    </div>
  );
}
```

**Pattern 3: Checkbox/Radio Groups**

Each option in a group should be wrapped in its own `<Label>`:

```tsx
// ✅ Checkbox Group
<CheckboxGroup aria-label="Select frameworks" defaultValue={["next"]}>
  <Label>
    <Checkbox value="next" />
    Next.js
  </Label>
  <Label>
    <Checkbox value="vite" />
    Vite
  </Label>
  <Label>
    <Checkbox value="astro" />
    Astro
  </Label>
</CheckboxGroup>

// ✅ Radio Group
<RadioGroup defaultValue="next">
  <Label>
    <Radio value="next" />
    Next.js
  </Label>
  <Label>
    <Radio value="vite" />
    Vite
  </Label>
</RadioGroup>
```

**Pattern 4: In Form Fields**

When using Field components, place the checkbox/radio inside `FieldLabel`:

```tsx
<Field name="terms">
  <FieldLabel>
    <Checkbox value="yes" />
    Accept terms and conditions
  </FieldLabel>
</Field>
```

**Important:**
- Always wrap checkbox/radio/switch controls with their label text in a `<Label>` component
- Only use `id`/`htmlFor` pattern when you have additional content (like description text) that needs to be outside the label
- In groups, each option gets its own `<Label>` wrapper
- Never use `aria-label` on checkboxes/radios/switches when they have visible labels - the `<Label>` component handles the association automatically

### Form Fields

**Use Field components for proper form structure:**

```tsx
<Field>
  <FieldLabel>Password</FieldLabel>
  <Input type="password" required />
  <FieldError>Please fill out this field.</FieldError>
</Field>
```

**Dialog / sheet / drawer forms:** Keep **`DialogHeader`** (or sheet/drawer header) **outside** `<Form>`. Wrap **`DialogPanel`** + **`DialogFooter`** in **`<Form className="contents">`** (or native `<form className="contents">`) so the popup flex layout stays correct.

---

## 7. State Management

### Static Data

**Define static data outside the function:**

```tsx
const items = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Astro", value: "astro" },
];

export default function Particle() {
  return (
    <Select items={items}>
      {/* ... */}
    </Select>
  );
}
```

### Stateful Particles

**When state is needed, add `"use client"` and use React hooks:**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  };

  return (
    <Button disabled={loading} onClick={handleClick}>
      {loading ? "Loading..." : "Submit"}
    </Button>
  );
}
```

**Prefer:**
- Named imports from "react" (e.g., `import { useState } from "react"`)
- Descriptive state variable names
- Clear handler function names

---

## 8. Styling Patterns

### Tailwind Classes

**Use Tailwind classes directly. Common patterns:**

- **Layout:** `flex`, `grid`, `gap-2`, `items-center`, `justify-between`
- **Spacing:** `p-4`, `px-3`, `py-2`, `gap-4`
- **Text:** `text-sm`, `text-muted-foreground`, `font-medium`
- **Sizing:** `w-full`, `max-w-xs`, `h-auto!` (use `!` for important overrides)
- **Custom overrides:** `className="pe-0"`, `className="*:[input]:px-0!"`

### Semantic Color Tokens

**Always use semantic color tokens, never raw colors:**

```tsx
// ✅ Good
className="text-muted-foreground"
className="bg-destructive text-destructive-foreground"

// ❌ Bad
className="text-gray-500"
className="bg-red-500 text-white"
```

### Border Color

**Never use `border-border` class - it's already set in globals.css by default:**

```tsx
// ❌ Bad - redundant class
className="border-b border-border"

// ✅ Good - border-border is the default
className="border-b"
```

### Important Overrides

**Use `!` suffix for important overrides when needed:**

```tsx
className="border-transparent! bg-transparent! shadow-none"
className="h-auto!"
```

### Hover and State Styling with data-slot

**Prefer `in-*` prefix with `data-slot` over the `group` class pattern:**

Every component has a `data-slot` attribute. Instead of using the `group` class on a parent and `group-hover:` on children, use the `in-*` prefix with `data-slot` selectors:

```tsx
// ❌ Avoid using group class
<Button className="group">
  Get Started
  <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
</Button>

// ✅ Use in-* prefix with data-slot
<Button>
  Get Started
  <ArrowRightIcon
    aria-hidden="true"
    className="in-[[data-slot=button]:hover]:translate-x-0.5 transition-transform"
  />
</Button>
```

**Common patterns:**
- `in-[[data-slot=button]:hover]:` - Style when parent button is hovered
- `in-[[data-slot=card]:hover]:` - Style when parent card is hovered
- `in-data-[slot=input-group]:` - Style when inside an input group

### Negative Margins

**Avoid negative margins when possible, but use them sparingly when needed for visual balance:**

- Negative margins are sometimes necessary to make elements look visually balanced inside buttons
- Use conservative values (e.g., `-me-1` rather than `-me-1.5`)
- The appropriate value depends on the button size - find the right balance without exaggerating
- Apply negative margins to wrapper elements (like `KbdGroup`) rather than individual items

```tsx
// ✅ Negative margin on wrapper for visual balance
<Button variant="outline">
  Print
  <KbdGroup className="-me-1">
    <Kbd>⌘</Kbd>
    <Kbd>P</Kbd>
  </KbdGroup>
</Button>

// ✅ Negative margin on badge for alignment
<Button variant="outline">
  Messages
  <Badge className="-me-1" variant="outline">18</Badge>
</Button>
```

---

## 9. Composition Patterns

### Simple Composition

**Single component with props:**

```tsx
export default function Particle() {
  return <Button variant="outline">Click me</Button>;
}
```

### Nested Composition

**Multiple components composed together:**

```tsx
export default function Particle() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardPanel>
        <Input placeholder="Enter text" type="text" />
      </CardPanel>
      <CardFooter>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}
```

### Trigger-Based Components

**Menu/Dialog/Popover patterns:**

```tsx
export default function Particle() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>
        Open Menu
      </MenuTrigger>
      <MenuPopup>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </MenuPopup>
    </Menu>
  );
}
```

**Important:** Always use `render` prop instead of `asChild` (Base UI pattern, not Radix).

### Portal props on composed popups (`portalProps`)

Many registry `*Popup` components (and **toast** `ToastProvider` / `AnchoredToastProvider`) wrap Base UI **`Portal`** internally. When a surface exposes **`portalProps`**, pass Base UI portal options there (for example **`keepMounted`** or **`container`**) instead of duplicating the whole portal + positioner tree.

**Where it exists:** only the surfaces listed in `apps/ui/skills/coss/references/portal-props.md`. Do not add `portalProps` to registry helpers that are not on that list (their portal stays internal).

### Group Components

**Use Group for connected button groups:**

```tsx
import { Group, GroupSeparator } from "@/registry/default/ui/group";

export default function Particle() {
  return (
    <Group aria-label="File actions">
      <Button variant="outline">
        <FilesIcon />
        Files
      </Button>
      <GroupSeparator />
      <Button variant="outline">
        <FilmIcon />
        Media
      </Button>
      <GroupSeparator />
      <Menu>
        <MenuTrigger render={<Button aria-label="Menu" size="icon" variant="outline" />}>
          <EllipsisIcon className="size-4" />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuItem>Edit</MenuItem>
        </MenuPopup>
      </Menu>
    </Group>
  );
}
```

**Important:** `GroupSeparator` is **always required** between controls in Group, including outline buttons.

---

## 10. Migration from Origin (shadcn/Radix) to coss (Base UI)

### Understanding the Migration

When creating a particle equivalent to an origin component:

1. **Read the origin component** (`apps/origin/registry/default/ui/{component}.tsx`)
2. **Check the migration guide** (`apps/ui/content/docs/(root)/radix-shadcn-migration.mdx`)
3. **Compare the primitives:**
   - Origin uses Radix UI primitives
   - coss uses Base UI primitives
   - Understand why certain classes were used in origin
4. **Look at existing particles** in the same category for consistency
5. **Understand the differences:**
   - `asChild` → `render` prop (triggers / composed parts — not Button-as-link)
   - Button links → `buttonVariants` on `<a>` / `Link` (not `Button render`)
   - `*Content` → `*Popup` or `*Panel`
   - `onSelect` → `onClick` (Menu)
   - `type="multiple"` → `multiple={true}`
   - Size differences (coss is more compact)

### Key Migration Patterns

**asChild → render (triggers / composed parts):**

```tsx
// Origin (Radix)
<DropdownMenuTrigger asChild>
  <Button>Open</Button>
</DropdownMenuTrigger>

// coss (Base UI)
<MenuTrigger render={<Button />}>Open</MenuTrigger>
```

**Button links → `buttonVariants` (not `Button render`):**

```tsx
// Origin (Radix / older coss)
<Button asChild>
  <Link href="/login">Login</Link>
</Button>
// or: <Button render={<Link href="/login" />}>Login</Button>

// coss (Base UI Button)
import { buttonVariants } from "@/registry/default/ui/button";

<Link className={buttonVariants()} href="/login">
  Login
</Link>
```

**Component naming:**

```tsx
// Origin
<DialogContent>
  <DialogHeader>...</DialogHeader>
</DialogContent>

// coss
<DialogPopup>
  <DialogHeader>...</DialogHeader>
  <DialogPanel>Content</DialogPanel>
</DialogPopup>
```

**Menu items:**

```tsx
// Origin
<DropdownMenuItem onSelect={() => console.log("clicked")}>
  Item
</DropdownMenuItem>

// coss
<MenuItem onClick={() => console.log("clicked")}>
  Item
</MenuItem>
```

**Select with items:**

```tsx
// Origin
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="next">Next.js</SelectItem>
  </SelectContent>
</Select>

// coss
<Select items={[
  { label: "Select...", value: null },
  { label: "Next.js", value: "next" },
]}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectPopup>
    {items.map((item) => (
      <SelectItem key={item.value} value={item}>
        {item.label}
      </SelectItem>
    ))}
  </SelectPopup>
</Select>
```

### Size Mapping

**When migrating, map sizes to preserve visual appearance:**

| Component | shadcn/ui Size | coss ui Size |
|-----------|----------------|--------------|
| Button    | `default` (36px) | `lg` (36px) |
| Button    | `sm` (32px) | `default` (32px) |
| Input     | `default` (36px) | `lg` (36px) |
| Input     | `sm` (32px) | `default` (32px) |
| Select    | `default` (36px) | `lg` (36px) |
| Select    | `sm` (32px) | `default` (32px) |

**coss ui is more compact by default, so use larger sizes to match shadcn/ui appearance.**

### Understanding Class Overrides

**When you see custom classes in origin components:**

1. **Check what the class overrides** - look at the default styles in both libraries
2. **Understand why it was needed** - was it a Radix limitation? A design choice?
3. **Check if Base UI needs the same override** - Base UI might handle it differently
4. **Look at existing coss particles** - see if similar patterns exist

**Example:**

```tsx
// Origin might have:
className="[&_svg]:size-4 [&_svg]:pointer-events-none"

// coss might handle this automatically, or need:
className="[&_svg:not([class*='size-'])]:size-4"
```

---

## 11. Registry Metadata

**Add entry to `apps/ui/registry/registry-particles.ts`:**

```tsx
{
  name: "p-button-25",
  description: "Button with loading state",
  type: "registry:block",
  categories: categories("button", "loading"),
  dependencies: ["lucide-react"],  // only if using icons
  registryDependencies: ["@coss/button", "@coss/spinner"],
  files: [{ path: "particles/p-button-25.tsx", type: "registry:block" }],
  meta: {
    className: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  },
}
```

**Required fields:**
- `name`: Must match filename without `.tsx` (e.g., `"p-button-25"`)
- `description`: Brief description (≤ 15 words), focus on what it does, not implementation
- `type`: Always `"registry:block"`
- `categories`: Use `categories()` helper with valid categories from `registry-categories.ts`
- `registryDependencies`: Array of `@coss/{component}` package names
- `files`: Array with `path` and `type: "registry:block"`

**Optional fields:**
- `dependencies`: External npm packages (e.g., `["lucide-react"]` for icons)
- `meta.className`: Preview container styling (e.g., `"**:data-[slot=preview]:w-full"`)

**Category names:**
- Use spaces, not hyphens (e.g., `"input group"`, `"alert dialog"`, `"empty state"`)
- All valid categories are typed in `registry-categories.ts`
- The `categories()` helper ensures type safety

---

## 12. Valid Categories

**Component categories:**
accordion, alert, alert dialog, autocomplete, avatar, badge, breadcrumb, button, card, checkbox, checkbox group, collapsible, combobox, command, dialog, dropdown, empty state, field, fieldset, form, frame, group, input, input group, kbd, label, menu, meter, number field, pagination, popover, preview card, progress, radio group, scroll area, select, separator, sheet, skeleton, slider, spinner, switch, table, tabs, textarea, toast, toggle, toggle group, toolbar, tooltip

**Tag categories:**
async, copy, disabled, error, file, filter, info, loading, multiselect, password, search, sort, success, tag, tanstack, text editor, time, upload, validation, warning, zod

**Important:** All category names are typed in `registry-categories.ts`. Use the `categories()` helper function for type safety.

**Menu components must include the "dropdown" category:** The "dropdown" category is an alias for "menu" since many users search for "dropdown" when looking for menu components. Every particle that uses the Menu component should include both "dropdown" and "menu" in its categories.

**Adding New Categories:**

If you need a category that doesn't exist, you can add it to `apps/ui/registry/registry-categories.ts`. Categories are divided into:
- **Component categories**: Main UI components (e.g., `"input"`, `"button"`) - add to `componentCategories` array
- **Tag categories**: Additional tags/features (e.g., `"loading"`, `"disabled"`) - add to `tagCategories` array

After adding a new category, it will be available for use with the `categories()` helper function.

---

## 13. React and Next.js Best Practices

### React Patterns

**Use modern React patterns:**

```tsx
// ✅ Prefer function components
export default function Particle() {
  return <Button>Click</Button>;
}

// ✅ Use useId() for form associations
const id = useId();

// ✅ Use descriptive variable names
const [isLoading, setIsLoading] = useState(false);

// ✅ Extract complex logic to handlers
const handleSubmit = async () => {
  setIsLoading(true);
  // ...
  setIsLoading(false);
};
```

### Next.js Considerations

**Particles should be framework-agnostic, but consider:**

- Avoid Next.js-specific APIs (`next/link`, `next/image`) unless the particle specifically demonstrates Next.js integration
- Use standard HTML elements and React patterns
- For navigation that should look like a button, style `<a>` / `Link` with `buttonVariants` — do not use `<Button render={<a|Link />}>`
- Other primitives may still use `render` for links (for example `BreadcrumbLink`, `Badge`, `MenuLinkItem`)

---

## 14. Consistency with Existing Particles

**Before creating a new particle:**

1. **Search existing particles** in the same category
2. **Review patterns** used in similar particles
3. **Match the style** and composition approach
4. **Use consistent naming** and structure
5. **Follow the same icon/accessibility patterns**

**Example workflow:**

```bash
# 1. Find existing particles in category
ls apps/ui/registry/default/particles/p-button-*.tsx

# 2. Read a few examples
cat apps/ui/registry/default/particles/p-button-1.tsx
cat apps/ui/registry/default/particles/p-button-18.tsx

# 3. Check registry for numbering
grep "p-button" apps/ui/registry/registry-particles.ts

# 4. Create new particle following patterns
```

---

## 15. Best Practices Summary

### Code Quality

- ✅ Keep particles focused on demonstrating one feature or pattern
- ✅ Use realistic placeholder text and data
- ✅ Prefer composition over complexity
- ✅ Don't add comments unless explaining something non-obvious
- ✅ Use semantic color tokens (`text-muted-foreground`) not raw colors
- ✅ Test that the particle renders correctly before committing

### Accessibility

- ✅ Always provide `aria-label` for icon-only interactive elements
- ✅ Use `aria-hidden="true"` for decorative icons
- ✅ Pair labels with inputs using `useId()`
- ✅ Use Field components for proper form structure

### Performance

- ✅ Define static data outside the component function
- ✅ Only add `"use client"` when actually needed
- ✅ Avoid unnecessary re-renders
- ✅ Use appropriate React patterns (hooks, memoization when needed)

### Consistency

- ✅ Follow existing patterns in the same category
- ✅ Use consistent icon opacity and accessibility patterns
- ✅ Match the styling approach of similar particles
- ✅ Use the same import patterns

---

## 16. Building and Validating the Registry

After creating a particle and adding it to the registry, you must build and validate:

### Build Steps

**From the `apps/ui` directory, run these commands in order:**

```bash
cd apps/ui

# 1. Format code and sort imports
bun run format:all

# 2. Validate registry dependencies
bun run registry:validate-deps

# 3. Build registry JSON files
bun run registry:build

# 4. Copy UI components to packages folder (if needed)
bun run ui:sync
```

### What Each Command Does

**`bun run format:all`:**
- Formats code with Prettier
- Sorts imports automatically
- Ensures consistent code style

**`bun run registry:validate-deps`:**
- Validates that all `registryDependencies` in `registry-particles.ts` are correct
- Ensures dependencies match what's actually imported in particle files
- Catches missing or incorrect dependency declarations
- **Important:** Run this before `registry:build` to catch dependency errors early

**`bun run registry:build`:**
- Generates `registry/__index__.tsx` with all particles
- Generates `registry.json` and `public/r/registry.json`
- Builds individual JSON files for each particle in `public/r/`
- **Note:** See `apps/ui/CONTRIBUTING.md` for more details on the build process

**`bun run ui:sync`:**
- Copies UI components from `apps/ui/registry/default/ui/` to `packages/ui/src/components/`
- Only needed if you've modified UI primitives
- Not needed for creating new particles (only for modifying base components)

### Additional Resources

- **Contributing Guide:** See `apps/ui/CONTRIBUTING.md` for detailed information about building the registry and contributing guidelines
- **Category Management:** New categories can be added to `apps/ui/registry/registry-categories.ts` if needed (see section 12 for details)

---

## 17. Quick Checklist

When creating a new particle:

- [ ] Created `apps/ui/registry/default/particles/p-{component}-{N}.tsx`
- [ ] Used `export default function Particle()` signature
- [ ] Added `"use client"` only if using hooks/state/event handlers
- [ ] Imported components from `@/registry/default/ui/{component}`
- [ ] Imported specific icons from `lucide-react`
- [ ] Used `aria-label` for icon-only interactive elements
- [ ] Used `aria-hidden="true"` for decorative icons
- [ ] Applied appropriate icon opacity (or none) based on context
- [ ] Specified `type` attribute explicitly on all Input and InputGroupInput components
- [ ] Used semantic color tokens
- [ ] Followed composition patterns from similar particles
- [ ] Added entry to `apps/ui/registry/registry-particles.ts`
- [ ] Used `categories()` helper with valid category names
- [ ] Included all `@coss/*` dependencies in `registryDependencies`
- [ ] Added `dependencies: ["lucide-react"]` if using icons
- [ ] Set appropriate `meta.className` if needed
- [ ] Formatted code: `bun run format:all`
- [ ] Validated dependencies: `bun run registry:validate-deps` from `apps/ui`
- [ ] Built registry: `bun run registry:build` from `apps/ui`
- [ ] Copied UI components: `bun run ui:sync` from `apps/ui` (if needed)

---

## 18. Migration Workflow for Origin Components

When asked to create an equivalent of an origin component:

1. **Read the origin component:**
   - `apps/origin/registry/default/ui/{component}.tsx`
   - Understand its structure and patterns
   - Note any custom classes or overrides

2. **Check the migration guide:**
   - `apps/ui/content/docs/(root)/radix-shadcn-migration.mdx`
   - Find the component's migration section
   - Understand prop mappings and API differences

3. **Review existing particles:**
   - Look at particles in the same category
   - Understand common patterns
   - See how similar features are implemented

4. **Compare primitives:**
   - Check what Radix primitive the origin uses
   - Check what Base UI primitive coss uses
   - Understand why classes were overridden in origin
   - Determine if the same override is needed in coss

5. **Create the particle:**
   - Follow all patterns from this guide
   - Use Base UI API (render prop, not asChild)
   - Match the visual appearance
   - Ensure accessibility is maintained

6. **Test and verify:**
   - Ensure it renders correctly
   - Check accessibility
   - Verify it matches the origin component's functionality
   - Ensure it follows coss patterns

---

## 19. Common Patterns Reference

### Button with Icon

```tsx
// Icon-only button
<Button aria-label="Close" size="icon" variant="ghost">
  <XIcon aria-hidden="true" />
</Button>

// Button with icon and text
<Button>
  <PlusIcon aria-hidden="true" />
  Add Item
</Button>
```

### Button with Keyboard Shortcut (Kbd)

**Each key needs its own `Kbd` component. Use `KbdGroup` when there are multiple keys:**

```tsx
// ✅ Multiple keys with KbdGroup
<Button variant="outline">
  <PrinterIcon aria-hidden="true" />
  Print
  <KbdGroup className="-me-1">
    <Kbd>⌘</Kbd>
    <Kbd>P</Kbd>
  </KbdGroup>
</Button>

// ✅ Single key
<Button variant="outline">
  Save
  <Kbd className="-me-1">⌘S</Kbd>
</Button>

// ❌ Don't put multiple keys in one Kbd
<Button variant="outline">
  Print
  <Kbd className="-me-1">⌘P</Kbd>
</Button>
```

### Button with Badge

**Match the badge variant with the button variant when appropriate:**

```tsx
// ✅ Outline badge in outline button
<Button variant="outline">
  Messages
  <Badge className="-me-1" variant="outline">18</Badge>
</Button>

// ✅ Default badge in default button
<Button>
  Notifications
  <Badge className="-me-1">5</Badge>
</Button>
```

### Input with Label

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" placeholder="your@email.com" />
  <FieldError>Invalid email</FieldError>
</Field>
```

### Menu with Trigger

```tsx
<Menu>
  <MenuTrigger render={<Button variant="outline" />}>
    Open Menu
  </MenuTrigger>
  <MenuPopup>
    <MenuItem closeOnClick>Edit</MenuItem>
    <MenuItem closeOnClick>Delete</MenuItem>
  </MenuPopup>
</Menu>
```

### Select with Items

```tsx
const items = [
  { label: "Select...", value: null },
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
];

<Select items={items}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectPopup>
    {items.map((item) => (
      <SelectItem key={item.value} value={item}>
        {item.label}
      </SelectItem>
    ))}
  </SelectPopup>
</Select>
```

### Dialog Pattern

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>
    Open Dialog
  </DialogTrigger>
  <DialogPopup>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogPanel>Content here</DialogPanel>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
      <DialogClose render={<Button />}>Confirm</DialogClose>
    </DialogFooter>
  </DialogPopup>
</Dialog>
```

---

## 20. Troubleshooting

### Common Issues

**Issue: Component doesn't render**
- Check if `"use client"` is needed
- Verify imports are correct
- Ensure default export is `Particle`

**Issue: Icons not showing**
- Verify icon imports are specific (not `import *`)
- Check if icon library is in dependencies

**Issue: Styling doesn't match**
- Check if using semantic tokens
- Verify size mapping (shadcn → coss)
- Compare with similar particles

**Issue: Accessibility warnings**
- Add `aria-label` for icon-only interactive elements
- Add `aria-hidden="true"` for decorative icons
- Use `useId()` for label-input pairs

**Issue: Registry build fails**
- Check category names match `registry-categories.ts` exactly
- Verify `registryDependencies` use `@coss/*` format
- Ensure `name` matches filename without `.tsx`

---

This guide should enable autonomous creation of particles that match the existing library's patterns, style, and best practices. Always refer to existing particles in the same category for consistency.
