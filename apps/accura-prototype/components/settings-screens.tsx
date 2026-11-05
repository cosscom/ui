"use client";

import { Avatar, AvatarFallback } from "@coss/ui/components/avatar";
import { Badge } from "@coss/ui/components/badge";
import { Button } from "@coss/ui/components/button";
import { Checkbox } from "@coss/ui/components/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@coss/ui/components/combobox";
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@coss/ui/components/empty";
import { Field, FieldLabel } from "@coss/ui/components/field";
import { Input } from "@coss/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@coss/ui/components/input-group";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@coss/ui/components/menu";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@coss/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@coss/ui/components/table";
import { toastManager } from "@coss/ui/components/toast";
import {
  Building as BuildingIcon,
  ArrowSeparateVertical as ChevronsUpDownIcon,
  ClipboardCheck as ClipboardCheckIcon,
  MultiplePages as FilesIcon,
  GraduationCap as GraduationCapIcon,
  Mail as MailIcon,
  MoreHoriz as MoreHorizontalIcon,
  EditPencil as PencilIcon,
  Plus as PlusIcon,
  RefreshDouble as RefreshCwIcon,
  Search as SearchIcon,
  WarningTriangle as TriangleAlertIcon,
  User as UserIcon,
  Tools as WrenchIcon,
} from "iconoir-react";
import { useMemo, useState } from "react";
import { AccuraInformationPanel } from "./accura-information-panel";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./accura-tabs";

type SettingsSection =
  | "asset-management"
  | "capa"
  | "change-control"
  | "deviations"
  | "documents"
  | "organization"
  | "training"
  | "users";

type AccessLevel = "read" | "write" | "write_all";

type Role = {
  access: Record<string, AccessLevel>;
  description: string;
  modules: string[];
  name: string;
  origin: "System";
};

type UserStatus = "Active" | "Inactive" | "Invitation pending";

type EditableUser = {
  departments: string[];
  email: string;
  id: string;
  name: string;
  roles: string[];
  status: UserStatus;
};

type UserFormState = {
  departments: string[];
  email: string;
  name: string;
  roles: string[];
};

type NavItem = {
  icon: typeof BuildingIcon;
  id: SettingsSection;
  label: string;
};

// Grouped because the eight sections are not peers: the first two configure
// the organisation itself, the rest configure one module each.
const navGroups: { items: NavItem[]; label: string }[] = [
  {
    items: [
      { icon: BuildingIcon, id: "organization", label: "Organization" },
      { icon: UserIcon, id: "users", label: "Users" },
    ],
    label: "Organisation",
  },
  {
    items: [
      { icon: FilesIcon, id: "documents", label: "Documents" },
      { icon: GraduationCapIcon, id: "training", label: "Training" },
      { icon: ClipboardCheckIcon, id: "capa", label: "CAPA" },
      { icon: RefreshCwIcon, id: "change-control", label: "Change Control" },
      { icon: TriangleAlertIcon, id: "deviations", label: "Deviations" },
      {
        icon: WrenchIcon,
        id: "asset-management",
        label: "Asset Management",
      },
    ],
    label: "Modules",
  },
];

const sectionIntro: Record<SettingsSection, string> = {
  "asset-management":
    "Asset categories, calibration intervals, and maintenance defaults.",
  capa: "CAPA classifications, due-date rules, and effectiveness checks.",
  "change-control":
    "Change categories, impact assessment, and approval routing.",
  deviations: "Deviation categories, severity levels, and escalation rules.",
  documents:
    "Document types, numbering, and review defaults used across the QMS.",
  organization: "Organisation profile, departments, sites, and locale.",
  training: "Curricula, assignment rules, and training record retention.",
  users: "Who can sign in to Accura and what each built-in role allows.",
};

// One vocabulary for module names across the whole app: the Settings nav, the
// role module badges, and the role filter all read the same.
const modules = [
  "Documents",
  "Training",
  "CAPA",
  "Change Control",
  "Deviations",
  "Asset Management",
  "Settings",
  "Knowledge Hub",
];

// Settings and Knowledge Hub are administrative surfaces, so the two
// non-admin built-in roles do not cover them.
const userModules = modules.filter(
  (module) => !["Knowledge Hub", "Settings"].includes(module),
);

// US-005 AC-03 wording. The PRD governs this copy, not the mockup.
const accessLevels: {
  detail: string;
  label: string;
  value: AccessLevel;
}[] = [
  {
    detail: "View approved or completed records.",
    label: "Read only",
    value: "read",
  },
  {
    detail:
      "Create new records; view, edit, review, or approve existing records only when owned or assigned to the user.",
    label: "Read and write",
    value: "write",
  },
  {
    detail:
      "Create new records; view, edit, review, or approve all existing records regardless of ownership or assignment.",
    label: "Read and write all records",
    value: "write_all",
  },
];

const accessLabels: Record<AccessLevel, string> = Object.fromEntries(
  accessLevels.map((level) => [level.value, level.label]),
) as Record<AccessLevel, string>;

// PRD-001: built-in roles only. Nothing in this screen creates or edits them.
const roles: Role[] = [
  {
    access: Object.fromEntries(
      modules.map((module) => [module, "write_all" as AccessLevel]),
    ),
    // Descriptions carry only what the Modules column cannot: the access
    // semantics. Spelling the module list out here duplicated the badges.
    description: "Read and write access to all records.",
    modules: [...modules],
    name: "Admin",
    origin: "System",
  },
  {
    access: Object.fromEntries(
      userModules.map((module) => [module, "write" as AccessLevel]),
    ),
    description: "Read and write access to their own or assigned records.",
    modules: [...userModules],
    name: "Normal User",
    origin: "System",
  },
  {
    access: Object.fromEntries(
      userModules.map((module) => [module, "read" as AccessLevel]),
    ),
    description: "View approved or completed records.",
    modules: [...userModules],
    name: "Read-only User",
    origin: "System",
  },
];

const initialUsers: EditableUser[] = [
  {
    departments: [],
    email: "sarah.johnson@example.com",
    id: "u-1",
    name: "Sarah Johnson",
    roles: ["Read-only User"],
    status: "Active",
  },
  {
    departments: [],
    email: "james.obrien@example.com",
    id: "u-2",
    name: "James O’Brien",
    roles: ["Normal User"],
    status: "Active",
  },
  {
    departments: [],
    email: "amit.kothari@example.com",
    id: "u-3",
    name: "Amit Kothari",
    roles: ["Admin"],
    status: "Active",
  },
  // Seeded so every status and the departments column are visible on load.
  {
    departments: ["Manufacturing", "Quality Assurance"],
    email: "priya.menon@example.com",
    id: "u-4",
    name: "Priya Menon",
    roles: ["Normal User"],
    status: "Invitation pending",
  },
  {
    departments: ["Engineering"],
    email: "daniel.ferreira@example.com",
    id: "u-5",
    name: "Daniel Ferreira",
    roles: ["Read-only User"],
    status: "Inactive",
  },
];

// Built-in document types from the mockup. The abbreviation drives Document ID
// generation (e.g. SOP-001).
const documentTypes = [
  {
    abbreviation: "BR",
    description: "Instructions and records for manufacturing a specific batch",
    name: "Batch Record",
  },
  {
    abbreviation: "DS",
    description: "Technical design details for implementing requirements",
    name: "Design Specification",
  },
  {
    abbreviation: "EXT",
    description: "Externally issued documents used by the organisation",
    name: "External Document",
  },
  {
    abbreviation: "FS",
    description: "Description of how a system will meet user requirements",
    name: "Functional Specification",
  },
  {
    abbreviation: "MS",
    description: "Requirements and acceptance criteria for materials",
    name: "Material Specification",
  },
  {
    abbreviation: "PS",
    description: "Requirements and acceptance criteria for a finished product",
    name: "Product Specification",
  },
  {
    abbreviation: "REC",
    description: "Evidence of activities performed or results obtained",
    name: "Record",
  },
  {
    abbreviation: "REP",
    description:
      "Documented results, findings and conclusions from an activity",
    name: "Report",
  },
  {
    abbreviation: "TMP",
    description: "Standard layout used to create consistent documents",
    name: "Template",
  },
  {
    abbreviation: "TM",
    description: "Instructions and criteria for performing a test",
    name: "Test Method",
  },
  {
    abbreviation: "URS",
    description: "Requirements describing what a system or equipment must do",
    name: "User Requirements Specification",
  },
  {
    abbreviation: "VMP",
    description:
      "Overall strategy and responsibilities for validation activities",
    name: "Validation Master Plan",
  },
];

const moduleFilterOptions = [
  { label: "All modules", value: "all" },
  ...modules.map((module) => ({ label: module, value: module })),
];

// A controlled list, not free text: typing departments by hand produced
// variants such as "Quality" and "Quality Assurance" for the same team.
const departmentOptions = [
  "Engineering",
  "Manufacturing",
  "Quality Assurance",
  "Quality Control",
].map((name) => ({ label: name, value: name }));

const statusBadgeVariant: Record<
  UserStatus,
  "secondary" | "success" | "warning"
> = {
  Active: "success",
  Inactive: "secondary",
  "Invitation pending": "warning",
};

const emptyForm: UserFormState = {
  departments: [],
  email: "",
  name: "",
  roles: [],
};

function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// One label convention for the whole form: a red asterisk marks required,
// "(Optional)" marks the rest. Both sit in a single child so FieldLabel's
// gap-2 does not push the marker away from the word it qualifies.
function FormLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <FieldLabel>
      <span>
        {children}
        {optional ? (
          <span className="ms-1 font-normal text-muted-foreground">
            (Optional)
          </span>
        ) : (
          <span aria-hidden="true" className="ms-0.5 text-destructive">
            *
          </span>
        )}
      </span>
    </FieldLabel>
  );
}

function getUserInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function UserIdentity({ user }: { user: EditableUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar
        aria-hidden="true"
        className="shrink-0 [--avatar-size:--spacing(8)]"
      >
        <AvatarFallback className="bg-[var(--accura-brand-150-lightshade)] text-[var(--accura-brand-950-darkshade)]">
          {getUserInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        {/* No status badge here: the Status column now carries it, and
            user-identity.md only asks for it beside the name when the row has
            nowhere else to show it. */}
        <p className="truncate font-medium">{user.name}</p>
        <p
          className="truncate text-muted-foreground text-xs"
          title={user.email}
        >
          {user.email}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({
  action,
  description,
  title,
}: {
  action?: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b bg-[var(--accura-zinc-50)] px-5 py-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-bold text-base leading-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

// One card per settings section: page canvas → card → table rows gives three
// readable planes instead of headings and tables floating side by side.
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
      {children}
    </section>
  );
}

function NotSpecified({ section }: { section: NavItem }) {
  const Icon = section.icon;
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{section.label} settings are not specified yet</EmptyTitle>
        <EmptyDescription>
          {sectionIntro[section.id]} No PRD or user story covers this section,
          so nothing is built here yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function RoleDetailsDialog({
  onOpenChange,
  role,
}: {
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}) {
  const grantedLevels = role
    ? accessLevels.filter((level) =>
        role.modules.some((module) => role.access[module] === level.value),
      )
    : [];

  return (
    <Dialog onOpenChange={onOpenChange} open={role !== null}>
      <DialogPopup className="sm:max-w-2xl">
        {role && (
          <>
            <DialogHeader>
              <DialogTitle>{role.name}</DialogTitle>
              <DialogDescription>
                Built-in role details. Access levels are managed by the system
                and cannot be changed here.
              </DialogDescription>
            </DialogHeader>
            {/* role.description is left out on purpose: it restates the
                access level (already the footnote) and the module list
                (already the table's first column). It stays in the role list,
                where it is the only summary available. */}
            <DialogPanel className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-bold text-base">Module access</h3>
                  <span className="text-muted-foreground text-xs">
                    {countLabel(role.modules.length, "module")}
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader className="bg-secondary/72">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="ps-5 text-xs">Module</TableHead>
                        <TableHead className="w-[230px] pe-4 text-xs">
                          Access level
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {role.modules.map((module) => (
                        <TableRow className="hover:bg-transparent" key={module}>
                          <TableCell className="ps-4 font-medium">
                            {module}
                          </TableCell>
                          <TableCell className="pe-4">
                            {accessLabels[role.access[module]]}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Only the levels this role actually grants. Defining all three
                  would explain two levels the role never uses, and a second
                  two-column block directly under the table reads as a second
                  table. */}
              <div className="flex flex-col gap-1.5 border-t pt-4">
                {grantedLevels.map((level) => (
                  <p
                    className="text-muted-foreground text-xs leading-snug"
                    key={level.value}
                  >
                    <span className="font-medium text-foreground">
                      {level.label}
                    </span>{" "}
                    – {level.detail}
                  </p>
                ))}
              </div>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Close
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogPopup>
    </Dialog>
  );
}

function UserFormDialog({
  editing,
  error,
  form,
  onOpenChange,
  onSubmit,
  open,
  setForm,
}: {
  editing: boolean;
  error: string | null;
  form: UserFormState;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
  setForm: (next: UserFormState) => void;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit user" : "Invite user"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update user details, departments, and role assignments."
              : "Add a user and assign their roles."}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-4">
          <Field>
            <FormLabel>Full name</FormLabel>
            <Input
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Enter full name"
              type="text"
              value={form.name}
            />
          </Field>

          <Field>
            <FormLabel>Email address</FormLabel>
            <Input
              // Input puts className on its wrapper span, which styles the
              // disabled state with has-disabled:, not disabled:. COSS only
              // dims it (opacity-64), so it reads as an empty enabled field;
              // Zinc 100 is the app's recessed plane, and full opacity keeps
              // the border crisp.
              className="has-disabled:bg-[var(--accura-canvas)] has-disabled:opacity-100 has-disabled:*:text-muted-foreground"
              disabled={editing}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="name@company.com"
              readOnly={editing}
              type="email"
              value={form.email}
            />
          </Field>

          <Field>
            <FormLabel optional>Departments</FormLabel>
            <Combobox
              items={departmentOptions}
              multiple
              onValueChange={(value: { label: string; value: string }[]) =>
                setForm({
                  ...form,
                  departments: value.map((item) => item.value),
                })
              }
              value={departmentOptions.filter((option) =>
                form.departments.includes(option.value),
              )}
            >
              <ComboboxChips
                endAddon={
                  <ComboboxTrigger
                    aria-label="Show departments"
                    className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronsUpDownIcon aria-hidden="true" />
                  </ComboboxTrigger>
                }
              >
                <ComboboxValue>
                  {(value: { label: string; value: string }[]) => (
                    <>
                      {value.map((item) => (
                        <ComboboxChip aria-label={item.label} key={item.value}>
                          {item.label}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        aria-label="Departments"
                        placeholder={
                          value.length > 0 ? undefined : "Select departments…"
                        }
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxPopup>
                <ComboboxEmpty>No departments found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: { label: string; value: string }) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxPopup>
            </Combobox>
          </Field>

          <div className="flex flex-col gap-2">
            <p className="font-medium text-base/4.5 sm:text-sm/4">
              Roles
              <span aria-hidden="true" className="ms-0.5 text-destructive">
                *
              </span>
            </p>
            <div className="flex flex-col gap-2">
              {roles.map((role) => {
                const checked = form.roles.includes(role.name);
                return (
                  <label
                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors hover:bg-secondary/72 has-[[data-checked]]:border-primary/32 has-[[data-checked]]:bg-secondary"
                    key={role.name}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(next) =>
                        setForm({
                          ...form,
                          roles: next
                            ? [...form.roles, role.name]
                            : form.roles.filter((name) => name !== role.name),
                        })
                      }
                    />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-medium text-sm">{role.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {role.modules.join(", ")}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {error && (
            <p
              className="rounded-lg border border-destructive/32 bg-destructive/8 px-3 py-2.5 text-destructive text-sm"
              role="alert"
            >
              {error}
            </p>
          )}

          {!editing && (
            <AccuraInformationPanel icon={MailIcon} title="Invitation email">
              After you send the invitation, the user receives a secure link to
              set up a password and then sign in.
            </AccuraInformationPanel>
          )}
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button onClick={onSubmit}>
            {editing ? "Save changes" : "Send invitation"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

export function SettingsScreen() {
  const [section, setSection] = useState<SettingsSection>("users");
  const [usersTab, setUsersTab] = useState<"roles" | "users">("users");
  const [users, setUsers] = useState<EditableUser[]>(initialUsers);
  const [userQuery, setUserQuery] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [typeQuery, setTypeQuery] = useState("");
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const activeItem = navGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === section) as NavItem;

  const visibleUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(query),
    );
  }, [userQuery, users]);

  const visibleRoles = useMemo(() => {
    const query = roleQuery.trim().toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) &&
        (moduleFilter === "all" || role.modules.includes(moduleFilter)),
    );
  }, [moduleFilter, roleQuery]);

  const visibleTypes = useMemo(() => {
    const query = typeQuery.trim().toLowerCase();
    if (!query) return documentTypes;
    return documentTypes.filter((type) =>
      `${type.name} ${type.abbreviation} ${type.description}`
        .toLowerCase()
        .includes(query),
    );
  }, [typeQuery]);

  const assignedCount = (roleName: string) =>
    users.filter((user) => user.roles.includes(roleName)).length;

  const openInvite = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (user: EditableUser) => {
    setEditingId(user.id);
    setForm({
      departments: [...user.departments],
      email: user.email,
      name: user.name,
      roles: [...user.roles],
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setFormError("Enter the user’s full name to continue.");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Enter a valid email address to continue.");
      return;
    }
    const duplicate = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== editingId,
    );
    if (duplicate) {
      setFormError(
        "Another user in this organisation already uses this email.",
      );
      return;
    }
    if (form.roles.length === 0) {
      setFormError("Select at least one role to continue.");
      return;
    }

    const departments = [...form.departments];

    if (editingId) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, departments, email, name, roles: [...form.roles] }
            : user,
        ),
      );
      toastManager.add({
        title: `Saved changes to ${name}.`,
        type: "success",
      });
    } else {
      setUsers((current) => [
        ...current,
        {
          departments,
          email,
          id: `u-${current.length + 1}-${Date.now()}`,
          name,
          roles: [...form.roles],
          status: "Invitation pending",
        },
      ]);
      toastManager.add({
        title: `Invitation sent to ${email}.`,
        type: "success",
      });
    }

    setFormOpen(false);
    setFormError(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-2xl leading-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure your organisation and each quality module.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start lg:gap-7 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8">
        <nav
          aria-label="Settings sections"
          className="flex flex-col gap-5 lg:sticky lg:top-20"
        >
          {navGroups.map((group) => (
            <div className="flex flex-col gap-1" key={group.label}>
              <p className="px-2.5 pb-1 font-medium text-muted-foreground text-xs">
                {group.label}
              </p>
              {group.items.map(({ icon: Icon, id, label }) => {
                const active = id === section;
                return (
                  <button
                    aria-current={active ? "page" : undefined}
                    className={`flex h-9 w-full items-center gap-2.5 rounded-lg border px-2.5 text-left text-sm outline-none transition-[background-color,border-color,box-shadow,color] focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "border-border bg-card font-medium text-foreground shadow-xs"
                        : "border-transparent text-muted-foreground hover:bg-secondary/72 hover:text-foreground"
                    }`}
                    key={id}
                    onClick={() => setSection(id)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="flex min-w-0 flex-col gap-4">
          {section === "users" && (
            <SectionCard>
              <SectionHeading
                action={
                  usersTab === "users" ? (
                    <Button onClick={openInvite}>
                      <PlusIcon aria-hidden="true" />
                      Invite user
                    </Button>
                  ) : undefined
                }
                description={sectionIntro.users}
                title="Users"
              />

              <Tabs
                onValueChange={(value) =>
                  setUsersTab(value as "roles" | "users")
                }
                value={usersTab}
              >
                <TabsList aria-label="User settings">
                  <TabsTab value="users">Users</TabsTab>
                  <TabsTab value="roles">Roles &amp; Permissions</TabsTab>
                </TabsList>

                <TabsPanel value="users">
                  <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <InputGroup className="max-w-sm">
                      <InputGroupAddon>
                        <SearchIcon aria-hidden="true" />
                      </InputGroupAddon>
                      <InputGroupInput
                        aria-label="Search users by name or email"
                        onChange={(event) => setUserQuery(event.target.value)}
                        placeholder="Search by name or email…"
                        type="search"
                        value={userQuery}
                      />
                    </InputGroup>
                    <span className="text-muted-foreground text-sm">
                      {countLabel(visibleUsers.length, "user")}
                    </span>
                  </div>

                  <div className="border-t">
                    <Table>
                      <TableHeader className="bg-secondary/72">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="min-w-[240px] ps-5 text-xs">
                            User
                          </TableHead>
                          <TableHead className="w-[170px] text-xs">
                            Status
                          </TableHead>
                          <TableHead className="min-w-[200px] text-xs">
                            Roles
                          </TableHead>
                          <TableHead className="w-[200px] text-xs">
                            Departments
                          </TableHead>
                          <TableHead className="w-14 pe-5 text-right text-xs">
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleUsers.length > 0 ? (
                          visibleUsers.map((user) => (
                            <TableRow
                              className="hover:bg-secondary/48"
                              key={user.id}
                            >
                              <TableCell className="max-w-[360px] ps-5">
                                <UserIdentity user={user} />
                              </TableCell>
                              <TableCell>
                                <Badge
                                  size="lg"
                                  variant={statusBadgeVariant[user.status]}
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="whitespace-normal">
                                <div className="flex flex-wrap gap-1.5">
                                  {user.roles.map((role) => (
                                    <Badge
                                      key={role}
                                      size="lg"
                                      variant="outline"
                                    >
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[220px] text-sm">
                                {/* Truncated rather than wrapped: a second
                                    line here made rows 60px against 53px. The
                                    full list stays available on hover. */}
                                <span
                                  className="block truncate"
                                  title={
                                    user.departments.join(", ") || undefined
                                  }
                                >
                                  {user.departments.length > 0
                                    ? user.departments.join(", ")
                                    : "—"}
                                </span>
                              </TableCell>
                              <TableCell className="pe-5 text-right">
                                <Menu>
                                  <MenuTrigger
                                    render={
                                      <Button
                                        aria-label={`More actions for ${user.name}`}
                                        size="icon-sm"
                                        variant="ghost"
                                      />
                                    }
                                  >
                                    <MoreHorizontalIcon aria-hidden="true" />
                                  </MenuTrigger>
                                  <MenuPopup align="end">
                                    <MenuItem onClick={() => openEdit(user)}>
                                      <PencilIcon aria-hidden="true" />
                                      Edit user
                                    </MenuItem>
                                  </MenuPopup>
                                </Menu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Empty>
                                <EmptyHeader>
                                  <EmptyMedia variant="icon">
                                    <UserIcon aria-hidden="true" />
                                  </EmptyMedia>
                                  <EmptyTitle>
                                    No users match your search.
                                  </EmptyTitle>
                                  <EmptyDescription>
                                    Clear the search to see everyone in this
                                    organisation.
                                  </EmptyDescription>
                                </EmptyHeader>
                              </Empty>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsPanel>

                <TabsPanel value="roles">
                  <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <InputGroup className="max-w-sm">
                      <InputGroupAddon>
                        <SearchIcon aria-hidden="true" />
                      </InputGroupAddon>
                      <InputGroupInput
                        aria-label="Search roles"
                        onChange={(event) => setRoleQuery(event.target.value)}
                        placeholder="Search roles…"
                        type="search"
                        value={roleQuery}
                      />
                    </InputGroup>
                    <Select
                      items={moduleFilterOptions}
                      onValueChange={(value) => setModuleFilter(String(value))}
                      value={moduleFilter}
                    >
                      <SelectTrigger
                        aria-label="Filter roles by module"
                        className="w-52"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        {moduleFilterOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectPopup>
                    </Select>
                    <span className="text-muted-foreground text-sm">
                      {countLabel(visibleRoles.length, "role")}
                    </span>
                  </div>

                  <div className="border-t">
                    <Table>
                      <TableHeader className="bg-secondary/72">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[150px] ps-5 text-xs">
                            Role
                          </TableHead>
                          <TableHead className="w-[30%] text-xs">
                            Description
                          </TableHead>
                          <TableHead className="text-xs">Modules</TableHead>
                          <TableHead className="w-[120px] text-xs">
                            Users assigned
                          </TableHead>
                          <TableHead className="w-[120px] pe-5 text-xs">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleRoles.length > 0 ? (
                          visibleRoles.map((role) => (
                            <TableRow
                              className="hover:bg-secondary/48"
                              key={role.name}
                            >
                              <TableCell className="ps-5 align-top font-medium">
                                {role.name}
                              </TableCell>
                              <TableCell className="whitespace-normal align-top text-muted-foreground text-sm leading-snug">
                                {role.description || "—"}
                              </TableCell>
                              <TableCell className="whitespace-normal align-top">
                                <div className="flex flex-wrap gap-1.5">
                                  {role.modules.length === modules.length ? (
                                    // Listing all eight when the role covers
                                    // every module is noise; the single badge
                                    // says the same thing in one line.
                                    <Badge size="lg" variant="outline">
                                      All modules
                                    </Badge>
                                  ) : (
                                    role.modules.map((module) => (
                                      <Badge
                                        key={module}
                                        size="lg"
                                        variant="outline"
                                      >
                                        {module}
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="align-top">
                                <span className="identifier text-sm">
                                  {assignedCount(role.name)}
                                </span>
                              </TableCell>
                              <TableCell className="pe-5 align-top">
                                <button
                                  className="text-primary text-sm outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
                                  onClick={() => setViewingRole(role)}
                                  type="button"
                                >
                                  View details
                                </button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Empty>
                                <EmptyHeader>
                                  <EmptyMedia variant="icon">
                                    <SearchIcon aria-hidden="true" />
                                  </EmptyMedia>
                                  <EmptyTitle>
                                    No roles match your search.
                                  </EmptyTitle>
                                  <EmptyDescription>
                                    Try another name or choose All modules.
                                  </EmptyDescription>
                                </EmptyHeader>
                              </Empty>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsPanel>
              </Tabs>
            </SectionCard>
          )}

          {section === "documents" && (
            <SectionCard>
              <SectionHeading
                description="Document types, numbering, and review defaults. The abbreviation drives Document ID generation, for example SOP-001."
                title="Document types"
              />

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <InputGroup className="max-w-sm">
                    <InputGroupAddon>
                      <SearchIcon aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-label="Search document types"
                      onChange={(event) => setTypeQuery(event.target.value)}
                      placeholder="Search document types…"
                      type="search"
                      value={typeQuery}
                    />
                  </InputGroup>
                  <span className="text-muted-foreground text-sm">
                    {countLabel(visibleTypes.length, "document type")}
                  </span>
                </div>

                <div className="border-t">
                  <Table>
                    <TableHeader className="bg-secondary/72">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[32%] ps-5 text-xs">
                          Name
                        </TableHead>
                        <TableHead className="w-[130px] text-xs">
                          Abbreviation
                        </TableHead>
                        <TableHead className="pe-5 text-xs">
                          Description
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleTypes.length > 0 ? (
                        visibleTypes.map((type) => (
                          <TableRow
                            className="hover:bg-secondary/48"
                            key={type.abbreviation}
                          >
                            <TableCell className="whitespace-normal ps-5 align-top font-medium">
                              {type.name}
                            </TableCell>
                            <TableCell className="align-top">
                              <Badge size="lg" variant="outline">
                                {type.abbreviation}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-normal pe-5 align-top text-muted-foreground text-sm leading-snug">
                              {type.description}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Empty>
                              <EmptyHeader>
                                <EmptyMedia variant="icon">
                                  <SearchIcon aria-hidden="true" />
                                </EmptyMedia>
                                <EmptyTitle>
                                  No document types match your search.
                                </EmptyTitle>
                                <EmptyDescription>
                                  Try another name or abbreviation.
                                </EmptyDescription>
                              </EmptyHeader>
                            </Empty>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </SectionCard>
          )}

          {section !== "users" && section !== "documents" && (
            <SectionCard>
              <SectionHeading
                description={sectionIntro[section]}
                title={activeItem.label}
              />
              <NotSpecified section={activeItem} />
            </SectionCard>
          )}
        </div>
      </div>

      <RoleDetailsDialog
        onOpenChange={(open) => {
          if (!open) setViewingRole(null);
        }}
        role={viewingRole}
      />

      <UserFormDialog
        editing={editingId !== null}
        error={formError}
        form={form}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setFormError(null);
        }}
        onSubmit={submitForm}
        open={formOpen}
        setForm={setForm}
      />
    </div>
  );
}
