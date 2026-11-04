"use client";

import { Avatar, AvatarFallback } from "@coss/ui/components/avatar";
import { Badge } from "@coss/ui/components/badge";
import { Button } from "@coss/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@coss/ui/components/dialog";
import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@coss/ui/components/drawer";
import { Field, FieldDescription, FieldLabel } from "@coss/ui/components/field";
import { Input } from "@coss/ui/components/input";
import { Progress } from "@coss/ui/components/progress";
import { Textarea } from "@coss/ui/components/textarea";
import {
  Archive as ArchiveIcon,
  ArrowLeft as ArrowLeftIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Clock as ClockIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Page as FileTextIcon,
  Lock as LockIcon,
  Attachment as PaperclipIcon,
  Printer as PrinterIcon,
  RefreshDouble as RefreshIcon,
  FloppyDisk as SaveIcon,
  ShieldCheck as ShieldCheckIcon,
  Upload as UploadIcon,
  User as UserIcon,
  Xmark as XIcon,
} from "iconoir-react";
import { useMemo, useState } from "react";

export type DocumentFlowView =
  | "create"
  | "draft"
  | "review"
  | "qa"
  | "approved";

type SignatureAction = "approve" | "reject" | "submit" | null;

type DocumentFlowScreenProps = {
  documentKind: string;
  onBack: () => void;
  onViewChange: (view: DocumentFlowView) => void;
  view: DocumentFlowView;
};

const workflowSteps = [
  { key: "draft", label: "Draft" },
  { key: "review", label: "In Review" },
  { key: "qa", label: "In QA Approval" },
  { key: "approved", label: "Approved" },
] as const;

const stageIndex: Record<DocumentFlowView, number> = {
  approved: 3,
  create: 0,
  draft: 0,
  qa: 2,
  review: 1,
};

function statusForView(view: DocumentFlowView) {
  if (view === "create" || view === "draft") return "Draft";
  if (view === "review") return "In Review";
  if (view === "qa") return "In QA Approval";
  return "Approved";
}

function statusVariant(view: DocumentFlowView) {
  if (view === "approved") return "success" as const;
  if (view === "review") return "warning" as const;
  if (view === "qa") return "info" as const;
  return "secondary" as const;
}

function WorkflowStepper({ view }: { view: DocumentFlowView }) {
  const current = stageIndex[view];
  return (
    <section
      aria-label="Document workflow"
      className="rounded-xl border bg-background px-4 py-4 shadow-xs"
    >
      <ol className="grid grid-cols-4 gap-2">
        {workflowSteps.map((step, index) => {
          const complete = index < current;
          const active = index === current;
          return (
            <li
              className="relative flex min-w-0 flex-col items-center gap-2 text-center"
              key={step.key}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute end-1/2 top-3 h-px w-full ${index <= current ? "bg-primary" : "bg-border"}`}
                />
              )}
              <span
                className={`relative z-1 flex size-6 items-center justify-center rounded-full border text-xs ${
                  complete
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary bg-background text-primary ring-4 ring-primary/12"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                {complete ? (
                  <CheckIcon aria-hidden="true" className="size-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`truncate text-xs ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
              <span className="text-[11px] text-muted-foreground max-md:hidden">
                {complete
                  ? "Completed by Amit Kothari"
                  : active
                    ? "Current stage"
                    : "Not started"}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Assignee({
  initials,
  label,
  roleLabel,
}: {
  initials: string;
  label: string;
  roleLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
      <Avatar className="[--avatar-size:--spacing(8)]">
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium text-sm">{label}</p>
        <p className="text-muted-foreground text-xs">{roleLabel}</p>
      </div>
    </div>
  );
}

function SignatureDialog({
  action,
  onComplete,
  onOpenChange,
}: {
  action: SignatureAction;
  onComplete: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const isReject = action === "reject";
  const title =
    action === "submit"
      ? "Submit & sign"
      : isReject
        ? "Reject & sign"
        : "Approve & sign";

  return (
    <Dialog onOpenChange={onOpenChange} open={action !== null}>
      <DialogPopup className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
            <ShieldCheckIcon aria-hidden="true" className="size-5" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This regulated action records your identity, role, signature
            meaning, and timestamp in the immutable audit trail.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-4">
          <div className="rounded-lg border bg-secondary/48 p-3 text-sm">
            <p className="font-medium">
              Amit Kothari ·{" "}
              {isReject
                ? "Review rejection"
                : action === "submit"
                  ? "Document author"
                  : "Quality approver"}
            </p>
            <p className="mt-1 text-muted-foreground">
              Meaning: I confirm this decision is accurate and attributable to
              me.
            </p>
          </div>
          {isReject && (
            <Field>
              <FieldLabel>Reason for rejection</FieldLabel>
              <Textarea
                aria-label="Reason for rejection"
                defaultValue="Changes are required before this document can advance."
              />
            </Field>
          )}
          <Field>
            <FieldLabel>Re-enter password</FieldLabel>
            <Input
              aria-label="Password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
            <FieldDescription>
              Prototype only — credentials are not submitted or stored.
            </FieldDescription>
          </Field>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button
            disabled={!password.trim()}
            onClick={onComplete}
            variant={isReject ? "destructive" : "default"}
          >
            <ShieldCheckIcon aria-hidden="true" />
            Confirm signature
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

function AuditDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const events = [
    [
      "QA approved and signed",
      "In QA Approval → Approved",
      "3 Nov 2026, 10:42 AM",
    ],
    [
      "Review approved and signed",
      "In Review → In QA Approval",
      "2 Nov 2026, 4:18 PM",
    ],
    ["Submitted for review", "Draft → In Review", "2 Nov 2026, 9:05 AM"],
    ["Document created", "Created as Draft", "1 Nov 2026, 3:31 PM"],
  ];
  return (
    <Drawer onOpenChange={onOpenChange} open={open} position="right">
      <DrawerPopup position="right" showCloseButton>
        <DrawerHeader>
          <DrawerTitle>Audit Trail Record</DrawerTitle>
          <DrawerDescription>
            ACME-FRM-2026-000006 · Equipment Introduction Form
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel className="pb-6">
          <ol className="relative flex flex-col gap-4 before:absolute before:inset-y-4 before:start-3.5 before:w-px before:bg-border">
            {events.map(([title, transition, time]) => (
              <li className="relative ps-11" key={title}>
                <span className="absolute start-0 top-3 z-1 flex size-7 items-center justify-center rounded-full border-4 border-popover bg-primary text-primary-foreground shadow-xs">
                  <CheckIcon aria-hidden="true" className="size-3" />
                </span>
                <article className="min-w-0 rounded-xl border bg-background p-4 shadow-xs">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-sm">{title}</p>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <p className="mt-2 text-sm">{transition}</p>
                  <p className="mt-2 text-muted-foreground text-xs">
                    Amit Kothari · {time} · GMT+7
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </DrawerPanel>
        <DrawerFooter>
          <Button className="w-full">
            <DownloadIcon aria-hidden="true" />
            Export audit report
          </Button>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  );
}

function EditorScreen({
  documentKind,
  onBack,
  onSubmit,
  view,
}: {
  documentKind: string;
  onBack: () => void;
  onSubmit: () => void;
  view: "create" | "draft";
}) {
  const isDraft = view === "draft";
  const [name, setName] = useState(
    isDraft ? "Batch Record – Line Clearance" : "",
  );
  const [attachmentAdded, setAttachmentAdded] = useState(isDraft);
  const readiness = useMemo(
    () =>
      name.trim() && attachmentAdded
        ? 100
        : name.trim() || attachmentAdded
          ? 67
          : 34,
    [attachmentAdded, name],
  );
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button
            className="-ms-2 mb-2"
            onClick={onBack}
            size="sm"
            variant="ghost"
          >
            <ArrowLeftIcon aria-hidden="true" />
            Back to Documents
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-bold text-2xl leading-tight">
              {isDraft
                ? "Edit Document — ACME-BR-2026-000001"
                : "Create new document"}
            </h1>
            {isDraft && <Badge variant="secondary">Draft</Badge>}
          </div>
          <p className="mt-1 text-muted-foreground text-sm">
            {isDraft
              ? "Complete the record and route it for technical review."
              : `Set up a ${documentKind === "external" ? "reference" : "controlled"} document and its approval route.`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <ClockIcon aria-hidden="true" className="size-4" />
          Saved just now
        </div>
      </div>

      <WorkflowStepper view="draft" />

      {!isDraft && (
        <section
          className="grid gap-3 rounded-xl border bg-background p-4 shadow-xs sm:grid-cols-2"
          aria-label="Document category"
        >
          <button
            className="flex items-start gap-3 rounded-lg border border-primary/32 bg-secondary p-4 text-left"
            type="button"
          >
            <CheckCircleIcon
              aria-hidden="true"
              className="mt-0.5 size-5 text-primary"
            />
            <span>
              <span className="block font-medium text-sm">
                Controlled document
              </span>
              <span className="mt-1 block text-muted-foreground text-xs">
                Formal review, QA approval, versioning, and effective-date
                management.
              </span>
            </span>
          </button>
          <button
            className="flex items-start gap-3 rounded-lg border p-4 text-left hover:bg-secondary/48"
            type="button"
          >
            <FileTextIcon
              aria-hidden="true"
              className="mt-0.5 size-5 text-muted-foreground"
            />
            <span>
              <span className="block font-medium text-sm">
                External document
              </span>
              <span className="mt-1 block text-muted-foreground text-xs">
                Reference material originating outside the organization.
              </span>
            </span>
          </button>
        </section>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <section className="rounded-xl border bg-background p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-base">Primary document</h2>
                <p className="text-muted-foreground text-xs">
                  PDF, DOCX, or XLSX · up to 50 MB
                </p>
              </div>
              {isDraft && <Badge variant="outline">Required</Badge>}
            </div>
            <button
              className="flex min-h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-secondary/24 text-center hover:bg-secondary/48"
              type="button"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-xs">
                <UploadIcon aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block font-medium text-sm">
                  Upload a document
                </span>
                <span className="mt-1 block text-muted-foreground text-xs">
                  Drag and drop or choose a file
                </span>
              </span>
            </button>
          </section>

          <section className="rounded-xl border bg-background p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-base">Attachments</h2>
                <p className="text-muted-foreground text-xs">
                  Add supporting files — maximum 5.
                </p>
              </div>
              <Button
                onClick={() => setAttachmentAdded(true)}
                size="sm"
                variant="outline"
              >
                <PaperclipIcon aria-hidden="true" />
                Add attachment
              </Button>
            </div>
            {attachmentAdded ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-secondary/24 p-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <FileTextIcon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-44 flex-1">
                  <p className="truncate font-medium text-sm">
                    equipment-specification.pdf
                  </p>
                  <p className="text-muted-foreground text-xs">
                    2.4 MB · Ready
                  </p>
                </div>
                <Button
                  aria-label="Remove attachment"
                  onClick={() => setAttachmentAdded(false)}
                  size="icon-sm"
                  variant="ghost"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
                No attachments added.
              </p>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-5 xl:sticky xl:top-24">
          <section className="rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">Ready to submit</h2>
            <div className="mt-3 flex items-center gap-3">
              <Progress className="flex-1" value={readiness} />
              <span className="font-medium text-sm">{readiness}%</span>
            </div>
            <p className="mt-3 text-muted-foreground text-xs">
              Complete the file, metadata, and approval route before signing.
            </p>
          </section>

          <section className="flex flex-col gap-4 rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">Document details</h2>
            <Field>
              <FieldLabel>Document name *</FieldLabel>
              <Input
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter a clear document name"
                type="text"
                value={name}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Type *</FieldLabel>
                <Input
                  disabled={isDraft}
                  type="text"
                  value={isDraft ? "Batch Record" : "Form"}
                />
              </Field>
              <Field>
                <FieldLabel>Department *</FieldLabel>
                <Input type="text" value="Quality Control" readOnly />
              </Field>
            </div>
            {isDraft && (
              <p className="flex items-center gap-2 text-muted-foreground text-xs">
                <LockIcon aria-hidden="true" className="size-3.5" />
                Document type is locked after creation.
              </p>
            )}
          </section>

          <section className="flex flex-col gap-3 rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">References</h2>
            <Field>
              <FieldLabel>Related documents</FieldLabel>
              <Input placeholder="Search documents to link…" type="search" />
            </Field>
            <Field>
              <FieldLabel>Referred documents</FieldLabel>
              <Input placeholder="Search referenced documents…" type="search" />
            </Field>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">Approval route</h2>
            <Assignee
              initials="AK"
              label="Amit Kothari"
              roleLabel="Technical reviewer"
            />
            <Assignee
              initials="NP"
              label="Nina Patel"
              roleLabel="QA approver"
            />
          </section>
        </aside>
      </div>

      <footer className="sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-3 shadow-lg/8">
        <p className="text-muted-foreground text-sm">
          {readiness === 100
            ? "All required information is ready."
            : "Complete the remaining required information before submission."}
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={onBack} variant="ghost">
            Cancel
          </Button>
          <Button variant="outline">
            <SaveIcon aria-hidden="true" />
            Save as draft
          </Button>
          <Button disabled={readiness !== 100} onClick={onSubmit}>
            Submit for review
          </Button>
        </div>
      </footer>
    </div>
  );
}

function DocumentPreview() {
  return (
    <div className="mx-auto min-h-[720px] max-w-3xl bg-white p-10 text-zinc-950 shadow-sm sm:p-14">
      <div className="border-b pb-5 text-center">
        <p className="identifier text-xs">ACME-FRM-2026-000006 · v1.0</p>
        <h2 className="mt-4 font-bold text-2xl">Equipment Introduction Form</h2>
      </div>
      <div className="mt-8 grid grid-cols-[160px_1fr] border border-zinc-300 text-sm">
        {[
          "Equipment name",
          "Model / catalogue",
          "Serial number",
          "Manufacturer",
          "Department",
          "Intended use",
        ].map((label) => (
          <div className="contents" key={label}>
            <div className="border-zinc-300 border-e border-b bg-zinc-100 p-3 font-medium">
              {label}
            </div>
            <div className="border-zinc-300 border-b p-3 text-zinc-500">
              Enter controlled information
            </div>
          </div>
        ))}
      </div>
      <h3 className="mt-10 font-semibold text-base">
        Section 2 · Qualification details
      </h3>
      <p className="mt-3 text-sm text-zinc-600 leading-6">
        Confirm that the equipment has been received, installed, and assessed
        against the approved specification. Record deviations through the linked
        quality workflow.
      </p>
    </div>
  );
}

function DetailScreen({
  onAudit,
  onBack,
  onDecision,
  onNewVersion,
  view,
}: {
  onAudit: () => void;
  onBack: () => void;
  onDecision: (action: Exclude<SignatureAction, null>) => void;
  onNewVersion: () => void;
  view: "approved" | "qa" | "review";
}) {
  const isApproved = view === "approved";
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button
            className="-ms-2 mb-2"
            onClick={onBack}
            size="sm"
            variant="ghost"
          >
            <ArrowLeftIcon aria-hidden="true" />
            Back to Documents
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-bold text-2xl leading-tight">
              Equipment Introduction Form
            </h1>
            <Badge variant={statusVariant(view)}>{statusForView(view)}</Badge>
          </div>
          <p className="identifier mt-1 text-muted-foreground text-xs">
            ACME-FRM-2026-000006 · v1.0
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline">
            <PrinterIcon aria-hidden="true" />
            Print
          </Button>
          <Button size="sm" variant="outline">
            <DownloadIcon aria-hidden="true" />
            Download
          </Button>
          {isApproved && (
            <Button onClick={onNewVersion} size="sm">
              <RefreshIcon aria-hidden="true" />
              New version
            </Button>
          )}
          <Button onClick={onAudit} size="sm" variant="outline">
            <ShieldCheckIcon aria-hidden="true" />
            View audit trail
          </Button>
          {isApproved && (
            <Button size="sm" variant="outline">
              <ArchiveIcon aria-hidden="true" />
              Mark as obsolete
            </Button>
          )}
        </div>
      </div>

      {view !== "approved" && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/72 px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-background text-primary">
            <UserIcon aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="font-medium text-sm">
              Your {view === "review" ? "technical review" : "QA approval"} is
              required
            </p>
            <p className="text-muted-foreground text-xs">
              Review the document and complete a signed decision.
            </p>
          </div>
        </div>
      )}

      <WorkflowStepper view={view} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-xl border bg-background shadow-xs">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="font-semibold text-base">Preview</h2>
              <p className="text-muted-foreground text-xs">
                Controlled document · Page 1 of 2
              </p>
            </div>
            <Badge variant="outline">
              <EyeIcon aria-hidden="true" />
              100%
            </Badge>
          </div>
          <div className="max-h-[760px] overflow-auto bg-zinc-200 p-5">
            <DocumentPreview />
          </div>
        </section>

        <aside className="flex flex-col gap-5 xl:sticky xl:top-24">
          <section className="rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">Document details</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              {[
                ["Document ID", "ACME-FRM-2026-000006"],
                ["Status", statusForView(view)],
                ["Version", "v1.0"],
                ["Department", "Quality Control"],
                ["Author", "Amit Kothari"],
                ["Effective date", isApproved ? "3 Nov 2026" : "—"],
              ].map(([term, value]) => (
                <div className="flex flex-col gap-1" key={term}>
                  <dt className="text-muted-foreground text-xs">{term}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">Workflow roles</h2>
            <div className="mt-3 flex flex-col gap-3">
              <Assignee
                initials="AK"
                label="Amit Kothari"
                roleLabel="Technical reviewer"
              />
              <Assignee
                initials="NP"
                label="Nina Patel"
                roleLabel="QA approver"
              />
            </div>
          </section>
          <section className="rounded-xl border bg-background p-5 shadow-xs">
            <h2 className="font-semibold text-base">Electronic signatures</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex gap-3">
                <CheckCircleIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <div>
                  <p className="font-medium text-sm">Author signature</p>
                  <p className="text-muted-foreground text-xs">
                    Amit Kothari · 2 Nov 2026, 9:05 AM
                  </p>
                </div>
              </div>
              {(view === "qa" || isApproved) && (
                <div className="flex gap-3">
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <p className="font-medium text-sm">Review signature</p>
                    <p className="text-muted-foreground text-xs">
                      Amit Kothari · 2 Nov 2026, 4:18 PM
                    </p>
                  </div>
                </div>
              )}
              {isApproved && (
                <div className="flex gap-3">
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <p className="font-medium text-sm">QA signature</p>
                    <p className="text-muted-foreground text-xs">
                      Nina Patel · 3 Nov 2026, 10:42 AM
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>

      {!isApproved && (
        <footer className="sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-3 shadow-lg/8">
          <p className="text-muted-foreground text-sm">
            Awaiting {view === "review" ? "review" : "QA approval"} by{" "}
            {view === "review" ? "Amit Kothari" : "Nina Patel"}.
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={() => onDecision("reject")} variant="destructive">
              Reject
            </Button>
            <Button onClick={() => onDecision("approve")}>
              <ShieldCheckIcon aria-hidden="true" />
              Approve & sign
            </Button>
          </div>
        </footer>
      )}
      {isApproved && (
        <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm shadow-xs">
          <CheckCircleIcon aria-hidden="true" className="size-5 text-primary" />
          <span>This document is approved and effective.</span>
        </div>
      )}
    </div>
  );
}

export function DocumentFlowScreen({
  documentKind,
  onBack,
  onViewChange,
  view,
}: DocumentFlowScreenProps) {
  const [signatureAction, setSignatureAction] = useState<SignatureAction>(null);
  const [auditOpen, setAuditOpen] = useState(false);

  const completeSignature = () => {
    if (signatureAction === "submit") onViewChange("review");
    if (signatureAction === "approve" && view === "review") onViewChange("qa");
    if (signatureAction === "approve" && view === "qa")
      onViewChange("approved");
    if (signatureAction === "reject") onViewChange("draft");
    setSignatureAction(null);
  };

  return (
    <>
      {view === "create" || view === "draft" ? (
        <EditorScreen
          documentKind={documentKind}
          onBack={onBack}
          onSubmit={() => setSignatureAction("submit")}
          view={view}
        />
      ) : (
        <DetailScreen
          onAudit={() => setAuditOpen(true)}
          onBack={onBack}
          onDecision={setSignatureAction}
          onNewVersion={() => onViewChange("draft")}
          view={view}
        />
      )}
      <SignatureDialog
        action={signatureAction}
        onComplete={completeSignature}
        onOpenChange={(open) => {
          if (!open) setSignatureAction(null);
        }}
      />
      <AuditDrawer onOpenChange={setAuditOpen} open={auditOpen} />
    </>
  );
}
