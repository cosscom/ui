# coss Alert Dialog

## When to use

- Critical confirmation flows before destructive actions.
- Blocking decisions that require explicit acknowledgement.

## When NOT to use

- If the content is informational (no destructive action) -> use Dialog instead.
- If the message is transient feedback -> use Toast instead.
- If the content is contextual and non-blocking -> use Popover instead.

## Install

```bash
npx shadcn@latest add @coss/alert-dialog
```

Manual deps from docs:

```bash
npm install @base-ui/react
```

## Canonical imports

```tsx
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
```

## Minimal pattern

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive-outline" />}>
    Delete Account
  </AlertDialogTrigger>
  <AlertDialogPopup>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
      <AlertDialogClose render={<Button variant="destructive" />}>
        Delete Account
      </AlertDialogClose>
    </AlertDialogFooter>
  </AlertDialogPopup>
</AlertDialog>
```

`AlertDialogClose` closes the dialog as soon as it is clicked, so use it as the confirm only when the action is synchronous. For async work, see **Async confirmation** below.

## Patterns from coss particles

- **Portal forwarding**: optional `portalProps` on `AlertDialogPopup` → Base UI `AlertDialog.Portal` (`keepMounted`, `container`, …). See [portal-props.md](../portal-props.md).
- **Section structure**: keep `AlertDialogHeader` and `AlertDialogFooter` as direct sections of `AlertDialogPopup` (there is no `AlertDialogPanel`; add a `div` or fragment between them only if you need extra body content).
- **Action composition**: use `AlertDialogClose render={<Button ... />}` for Cancel and for synchronous confirms to preserve button semantics and styling.
- **Destructive affordance**: pair destructive trigger/confirm variants (`destructive-outline`, `destructive`) for clear risk signaling.
- **Footer variants**: use `AlertDialogFooter variant="bare"` when border/background framing should be removed.
- **Close confirmation chain**: for unsaved changes in broader workflows, pair with dialog flows like `p-dialog-4`.

### Key patterns

Async confirmation (the dialog stays open until the mutation settles):

```tsx
const [open, setOpen] = useState(false)
const [isPending, setIsPending] = useState(false)

async function handleDelete() {
  setIsPending(true)
  try {
    await deleteAccount()
    setOpen(false)
  } catch {
    // Keep the dialog open so the user can retry; surface the error (e.g. a toast).
  } finally {
    setIsPending(false)
  }
}

<AlertDialog onOpenChange={setOpen} open={open}>
  <AlertDialogTrigger render={<Button variant="destructive-outline" />}>
    Delete Account
  </AlertDialogTrigger>
  <AlertDialogPopup>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
      <Button loading={isPending} onClick={handleDelete} variant="destructive">
        Delete Account
      </Button>
    </AlertDialogFooter>
  </AlertDialogPopup>
</AlertDialog>
```

- The confirm is a plain `Button` (not `AlertDialogClose`) with `loading`, which disables it and shows the spinner while the request runs.
- Close the dialog from the success path (`setOpen(false)`); on failure keep it open so the user can retry.
- Cancel stays an `AlertDialogClose` ghost button. Keep Cancel first in source: the footer is `flex-col-reverse` / `sm:flex-row sm:justify-end`, so the confirm renders on the right (or on top when stacked).
- With a query library, use its pending state (for example `mutation.isPending`) instead of local state.

## Common pitfalls

- Using AlertDialog as a generic content modal instead of high-risk confirmation UI.
- Omitting explicit destructive/cancel action distinction.
- Confirming an async action with `AlertDialogClose`: the dialog closes before the mutation settles, so there is no loading state and nowhere to show a failure.
- Wrapping dialog sections in extra containers that break built-in layout (use `className="contents"` only when needed).
- Mixing Dialog/Popover composition APIs without validating this primitive's parts.
- Skipping focus-return and escape-key verification on real trigger flows.

## Useful particle references

- core alert-dialog patterns: `p-alert-dialog-1`, `p-alert-dialog-2`
- related close-confirmation flow: `p-dialog-4`
