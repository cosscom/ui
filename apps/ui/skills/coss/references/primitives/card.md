# coss Card

## When to use

- Structured surface sections for grouped content.
- Settings, dashboard, and preview layouts with header/panel/footer semantics.

## Install

```bash
npx shadcn@latest add @coss/card
```

Manual deps from docs:

```bash
# No extra runtime dependency required for this primitive.
```

## Canonical imports

```tsx
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card"
```

`CardPanel` is also exported as `CardContent`.

## Minimal pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardPanel>Content</CardPanel>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Patterns from coss particles

### Key patterns

Card with form content:

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one click.</CardDescription>
  </CardHeader>
  <CardPanel className="flex flex-col gap-4">
    <Field>
      <FieldLabel>Name</FieldLabel>
      <Input type="text" placeholder="My project" />
    </Field>
  </CardPanel>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="ghost">Cancel</Button>
    <Button>Create</Button>
  </CardFooter>
</Card>
```

Keep `CardHeader`, `CardPanel`, and `CardFooter` as direct children of `Card` to preserve built-in spacing and layout.

Put header actions in `CardAction`, a sibling of `CardTitle` and `CardDescription` inside `CardHeader`; it is placed top-right via the header grid.

### CardFrame

`CardFrame` is a muted outer shell with its own header and footer around one or more inner `Card`s (or a `Table variant="card"`). Use it when a section needs a title row, an optional action, and a footnote outside the main surface.

```tsx
<CardFrame>
  <CardFrameHeader>
    <CardFrameTitle>Projects</CardFrameTitle>
    <CardFrameDescription>Manage your projects</CardFrameDescription>
    <CardFrameAction>
      <Button variant="outline">
        <PlusIcon aria-hidden="true" />
        Add
      </Button>
    </CardFrameAction>
  </CardFrameHeader>
  <Card>
    <CardPanel>Content</CardPanel>
  </Card>
  <CardFrameFooter>Footnote or secondary info</CardFrameFooter>
</CardFrame>
```

- Keep `CardFrameHeader`, the inner `Card`(s), and `CardFrameFooter` as direct children of `CardFrame`; the frame clips, rounds, and removes shadows on direct `Card` children only.
- `CardFrameAction` goes inside `CardFrameHeader` as a sibling of the title and description; it sits in the second grid column, vertically centered.
- Do not use `CardHeader`/`CardFooter` on the frame itself; those belong to the inner `Card`.
- For tables, render `Table variant="card"` as a direct child of `CardFrame` (see table guide, `p-table-6` through `p-table-8`).

### More examples

See `p-card-1` through `p-card-11` for various card compositions.

## Common pitfalls

- Skipping `CardHeader`/`CardPanel`/`CardFooter` structure in composed cards.
- Mixing unrelated layout wrappers that break spacing between card sections.
- Using cards as generic wrappers when `Frame` or plain layout would be clearer.
- Nesting a `Card` inside another wrapper within `CardFrame`, which skips the frame's clipping and radius rules for direct `Card` children.

## Useful particle references

- core patterns: `p-card-1`, `p-card-2`, `p-card-3`, `p-card-4`, `p-card-5`, `p-card-6`, `p-card-7`, `p-card-8`
- `CardFrame` with footer: `p-card-4`; with header: `p-card-5`; header + footer: `p-card-6`, `p-card-7`
- `CardFrame` with header action: `p-card-11`
