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
  DialogTrigger,
} from "@coss/ui/components/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@coss/ui/components/input-group";
import { Kbd } from "@coss/ui/components/kbd";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@coss/ui/components/menu";
import { Radio, RadioGroup } from "@coss/ui/components/radio-group";
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
import {
  Reports as BarChart3Icon,
  BellNotification as BellIcon,
  OpenBook as BookOpenIcon,
  NavArrowLeft as ChevronLeftIcon,
  NavArrowRight as ChevronRightIcon,
  HelpCircle as CircleHelpIcon,
  ClipboardCheck as ClipboardCheckIcon,
  ClockRotateRight as FileClockIcon,
  PagePlus as FilePlus2Icon,
  PageSearch as FileSearchIcon,
  MultiplePages as FilesIcon,
  Page as FileTextIcon,
  GraduationCap as GraduationCapIcon,
  ViewGrid as LayoutDashboardIcon,
  LogOut as LogOutIcon,
  MoreHoriz as MoreHorizontalIcon,
  SidebarCollapse as PanelLeftCloseIcon,
  SidebarExpand as PanelLeftOpenIcon,
  Plus as PlusIcon,
  RefreshDouble as RefreshCwIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  FilterList as SlidersHorizontalIcon,
  WarningTriangle as TriangleAlertIcon,
  DeliveryTruck as TruckIcon,
  User as UserRoundIcon,
  Tools as WrenchIcon,
  Xmark as XIcon,
} from "iconoir-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardScreen } from "./dashboard-screen";
import {
  DocumentFlowScreen,
  type DocumentFlowView,
} from "./document-flow-screens";
import { SettingsScreen } from "./settings-screens";

type AppModule = "dashboard" | "documents" | "settings";

type DocumentStatus = "Approved" | "Draft" | "In QA Approval" | "In Review";

type DocumentRecord = {
  author: string;
  department:
    | "Engineering"
    | "Manufacturing"
    | "Quality Assurance"
    | "Quality Control";
  effectiveDate: string | null;
  id: string;
  name: string;
  status: DocumentStatus;
  type:
    | "Batch Record"
    | "Form"
    | "Policy"
    | "Procedure"
    | "Specification"
    | "SOP"
    | "Work Instruction";
  version: string;
};

const documentsOnly = process.env.NEXT_PUBLIC_ACCURA_DOCUMENTS_ONLY === "true";

const documents: DocumentRecord[] = [
  {
    author: "Amit Kothari",
    department: "Quality Control",
    effectiveDate: null,
    id: "ACME-BR-2026-000001",
    name: "Batch Record – Line Clearance",
    status: "Draft",
    type: "Batch Record",
    version: "v1.0",
  },
  {
    author: "Amit Kothari",
    department: "Quality Control",
    effectiveDate: null,
    id: "ACME-WI-2026-000013",
    name: "Equipment Cleaning Work Instruction",
    status: "In QA Approval",
    type: "Work Instruction",
    version: "v1.0",
  },
  {
    author: "Amit Kothari",
    department: "Quality Control",
    effectiveDate: "13 Oct 2026",
    id: "ACME-FRM-2026-000006",
    name: "Equipment Introduction Form",
    status: "Approved",
    type: "Form",
    version: "v1.0",
  },
  {
    author: "Amit Kothari",
    department: "Quality Assurance",
    effectiveDate: null,
    id: "ACME-FRM-2026-000005",
    name: "Document Review and Approval Form",
    status: "In Review",
    type: "Form",
    version: "v2.0",
  },
  {
    author: "Nina Patel",
    department: "Quality Assurance",
    effectiveDate: "11 Oct 2026",
    id: "ACME-SPEC-2026-000004",
    name: "eQMS Roles and Permissions Model",
    status: "Approved",
    type: "Specification",
    version: "v1.0",
  },
  {
    author: "Daniel Lee",
    department: "Engineering",
    effectiveDate: null,
    id: "ACME-PRO-2026-000001",
    name: "Equipment Installation Qualification Protocol",
    status: "In Review",
    type: "Procedure",
    version: "v2.0",
  },
  {
    author: "Nina Patel",
    department: "Quality Control",
    effectiveDate: "9 Oct 2026",
    id: "ACME-FRM-2026-000011",
    name: "Quality Event Assessment Form",
    status: "Approved",
    type: "Form",
    version: "v1.0",
  },
  {
    author: "Daniel Lee",
    department: "Engineering",
    effectiveDate: "5 Oct 2026",
    id: "ACME-PRO-2026-000008",
    name: "Equipment Operational Qualification Protocol",
    status: "Approved",
    type: "Procedure",
    version: "v1.0",
  },
  {
    author: "Chau Nguyen",
    department: "Engineering",
    effectiveDate: null,
    id: "ACME-POL-2026-000004",
    name: "Hardware Story Splitting Policy",
    status: "In Review",
    type: "Policy",
    version: "v1.0",
  },
  {
    author: "Nina Patel",
    department: "Manufacturing",
    effectiveDate: "4 Oct 2026",
    id: "ACME-SOP-2026-000016",
    name: "Sample Management",
    status: "Approved",
    type: "SOP",
    version: "v1.0",
  },
  {
    author: "Daniel Lee",
    department: "Manufacturing",
    effectiveDate: null,
    id: "ACME-WI-2026-000019",
    name: "Material Receipt and Inspection",
    status: "Draft",
    type: "Work Instruction",
    version: "v1.0",
  },
  {
    author: "Chau Nguyen",
    department: "Quality Assurance",
    effectiveDate: null,
    id: "ACME-SOP-2026-000021",
    name: "Controlled Document Lifecycle",
    status: "In QA Approval",
    type: "SOP",
    version: "v1.0",
  },
  {
    author: "Nina Patel",
    department: "Quality Control",
    effectiveDate: "30 Sep 2026",
    id: "ACME-SPEC-2026-000010",
    name: "Environmental Monitoring Limits",
    status: "Approved",
    type: "Specification",
    version: "v3.0",
  },
  {
    author: "Amit Kothari",
    department: "Manufacturing",
    effectiveDate: null,
    id: "ACME-BR-2026-000014",
    name: "Packaging Batch Record",
    status: "Draft",
    type: "Batch Record",
    version: "v1.0",
  },
  {
    author: "Daniel Lee",
    department: "Engineering",
    effectiveDate: "28 Sep 2026",
    id: "ACME-SOP-2026-000018",
    name: "Preventive Maintenance",
    status: "Approved",
    type: "SOP",
    version: "v2.0",
  },
  {
    author: "Chau Nguyen",
    department: "Quality Assurance",
    effectiveDate: null,
    id: "ACME-POL-2026-000009",
    name: "Data Integrity and Retention",
    status: "In Review",
    type: "Policy",
    version: "v1.0",
  },
  {
    author: "Nina Patel",
    department: "Quality Control",
    effectiveDate: "24 Sep 2026",
    id: "ACME-WI-2026-000025",
    name: "Analytical Balance Verification",
    status: "Approved",
    type: "Work Instruction",
    version: "v1.0",
  },
  {
    author: "Amit Kothari",
    department: "Quality Assurance",
    effectiveDate: null,
    id: "ACME-FRM-2026-000027",
    name: "Change Impact Assessment",
    status: "Draft",
    type: "Form",
    version: "v1.0",
  },
];

const navItems = [
  { icon: LayoutDashboardIcon, label: "Dashboard", module: "dashboard" },
  { icon: FilesIcon, label: "Documents", module: "documents" },
  { icon: GraduationCapIcon, label: "Training" },
  { icon: TriangleAlertIcon, label: "Deviations" },
  { icon: WrenchIcon, label: "Asset Management" },
  { icon: ClipboardCheckIcon, label: "CAPA" },
  { icon: RefreshCwIcon, label: "Change Control" },
  { icon: TruckIcon, label: "Supplier Management" },
  { icon: BarChart3Icon, label: "Reports" },
].filter((item) => !(documentsOnly && item.module === "dashboard"));

const secondaryNavItems: {
  icon: typeof BookOpenIcon;
  label: string;
  module?: AppModule;
}[] = [
  { icon: BookOpenIcon, label: "Knowledge Hub" },
  { icon: CircleHelpIcon, label: "Help Center" },
  { icon: SettingsIcon, label: "Settings", module: "settings" },
  { icon: LogOutIcon, label: "Log out" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "Draft" },
  { label: "In Review", value: "In Review" },
  { label: "In QA Approval", value: "In QA Approval" },
  { label: "Approved", value: "Approved" },
];

const typeOptions = [
  { label: "All types", value: "all" },
  ...Array.from(new Set(documents.map((document) => document.type))).map(
    (value) => ({ label: value, value }),
  ),
];

const departmentOptions = [
  { label: "All departments", value: "all" },
  ...Array.from(new Set(documents.map((document) => document.department))).map(
    (value) => ({ label: value, value }),
  ),
];

const pageSizeOptions = [
  { label: "10", value: "10" },
  { label: "15", value: "15" },
  { label: "20", value: "20" },
];

function StatusBadge({ status }: { status: DocumentStatus }) {
  const variant = {
    Approved: "success",
    Draft: "secondary",
    "In QA Approval": "info",
    "In Review": "warning",
  }[status] as "info" | "secondary" | "success" | "warning";

  return (
    <Badge size="lg" variant={variant}>
      {status}
    </Badge>
  );
}

function AppSidebar({
  activeModule,
  collapsed,
  onNavigate,
  onToggle,
}: {
  activeModule: AppModule;
  collapsed: boolean;
  onNavigate: (module: AppModule) => void;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`sticky top-2 flex h-[calc(100svh-1rem)] shrink-0 flex-col overflow-hidden rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-200 ${collapsed ? "w-16" : "w-[248px]"}`}
    >
      <div
        className={`flex h-16 shrink-0 items-center ${collapsed ? "justify-center px-2" : "px-3"}`}
      >
        {collapsed ? (
          <button
            aria-label="Expand navigation"
            className="group relative flex size-10 items-center justify-center rounded-lg outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            onClick={onToggle}
            type="button"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-8 object-contain brightness-0 invert transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
              height={32}
              priority
              src="/brand/accura-mark.svg"
              width={32}
            />
            <PanelLeftOpenIcon
              aria-hidden="true"
              className="absolute size-5 text-sidebar-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </button>
        ) : (
          <>
            <Image
              alt="Accura"
              className="h-9 w-auto object-contain object-left brightness-0 invert"
              height={59}
              priority
              src="/brand/accura-logo.svg"
              width={164}
            />
            <Button
              aria-label="Collapse navigation"
              className="ms-auto text-sidebar-foreground hover:bg-white/10 hover:text-white"
              onClick={onToggle}
              size="icon-sm"
              variant="ghost"
            >
              <PanelLeftCloseIcon aria-hidden="true" />
            </Button>
          </>
        )}
      </div>

      <nav aria-label="Primary navigation" className="flex flex-col gap-1 p-2">
        {navItems.map(({ icon: Icon, label, module }) => {
          const active = module === activeModule;
          return (
            <button
              key={label}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? label : undefined}
              className={`flex h-9 w-full items-center rounded-lg text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
                collapsed ? "justify-center px-0" : "gap-3 px-2.5"
              } ${
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-xs"
                  : "hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => {
                if (module === "dashboard" || module === "documents") {
                  onNavigate(module);
                }
              }}
              type="button"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className={`truncate ${collapsed ? "hidden" : "block"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <nav
        aria-label="Support navigation"
        className="mt-auto flex flex-col gap-1 border-sidebar-border border-t p-2"
      >
        {secondaryNavItems.map(({ icon: Icon, label, module }) => (
          <button
            key={label}
            aria-current={module === activeModule ? "page" : undefined}
            aria-label={collapsed ? label : undefined}
            className={`flex h-9 w-full items-center rounded-lg text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
              collapsed ? "justify-center px-0" : "gap-3 px-2.5"
            } ${
              module === activeModule
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-xs"
                : "hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => {
              if (module) onNavigate(module);
            }}
            type="button"
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span className={`truncate ${collapsed ? "hidden" : "block"}`}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function DocumentsPrototype() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState<AppModule>(
    documentsOnly ? "documents" : "dashboard",
  );
  const [globalQuery, setGlobalQuery] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [department, setDepartment] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [documentKind, setDocumentKind] = useState("controlled");
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"list" | DocumentFlowView>(
    "list",
  );
  const globalSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusGlobalSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        globalSearchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusGlobalSearch);
    return () => window.removeEventListener("keydown", focusGlobalSearch);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 960) setSidebarCollapsed(true);
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [document.id, document.name, document.author].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      return (
        matchesQuery &&
        (status === "all" || document.status === status) &&
        (type === "all" || document.type === type) &&
        (department === "all" || document.department === department)
      );
    });
  }, [department, query, status, type]);

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleDocuments = filteredDocuments.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const hasActiveFilters =
    query.length > 0 ||
    status !== "all" ||
    type !== "all" ||
    department !== "all";

  const resetPage = () => setPage(1);
  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setType("all");
    setDepartment("all");
    setPage(1);
  };

  const navigateToView = (view: "list" | DocumentFlowView) => {
    setActiveView(view);
    window.scrollTo({ top: 0 });
  };

  const openDocument = (document: DocumentRecord) => {
    setActiveModule("documents");
    if (document.status === "Draft") navigateToView("draft");
    if (document.status === "In Review") navigateToView("review");
    if (document.status === "In QA Approval") navigateToView("qa");
    if (document.status === "Approved") navigateToView("approved");
    setSelectedDocument(null);
  };

  return (
    <div className="flex min-h-svh gap-2 bg-[var(--accura-canvas)] p-2">
      <AppSidebar
        activeModule={activeModule}
        collapsed={sidebarCollapsed}
        onNavigate={(module) => {
          setActiveModule(module);
          if (module === "documents") navigateToView("list");
        }}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center border-border border-b bg-[var(--accura-canvas)] p-3">
          <InputGroup className="h-10 max-w-2xl bg-background shadow-xs">
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Global search"
              onChange={(event) => setGlobalQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && globalQuery.trim()) {
                  setActiveModule("documents");
                  setQuery(globalQuery.trim());
                  setPage(1);
                  setNotice(
                    `Showing document matches for “${globalQuery.trim()}”.`,
                  );
                }
                if (event.key === "Escape") {
                  setGlobalQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder="Search for anything…"
              ref={globalSearchRef}
              type="search"
              value={globalQuery}
            />
            <InputGroupAddon align="inline-end" className="max-sm:hidden">
              <Kbd className="whitespace-nowrap bg-[var(--accura-brand-150-lightshade)] text-[var(--accura-brand-950-darkshade)]">
                ⌘ K
              </Kbd>
            </InputGroupAddon>
          </InputGroup>
          <div className="ms-auto flex items-center gap-2">
            <Button
              aria-label="Notifications, 3 unread"
              className="relative overflow-visible"
              size="icon"
              variant="ghost"
            >
              <BellIcon aria-hidden="true" />
              <span className="absolute end-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accura-coral)] px-1 font-medium text-[10px] text-[var(--accura-brand-950-darkshade)] ring-2 ring-background">
                3
              </span>
            </Button>
            <div className="mx-1 h-7 w-px bg-border" />
            <Avatar className="[--avatar-size:--spacing(8)]">
              <AvatarFallback className="bg-[var(--accura-brand-150-lightshade)] text-[var(--accura-brand-950-darkshade)]">
                AK
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 max-sm:hidden">
              <p className="truncate font-medium text-sm">Amit Kothari</p>
              <p className="text-muted-foreground text-xs">Member</p>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100svh-5rem)] p-5 sm:p-6 xl:p-8">
          {activeModule === "settings" ? (
            <SettingsScreen />
          ) : activeModule === "dashboard" ? (
            <DashboardScreen
              onOpenDocuments={() => {
                setActiveModule("documents");
                navigateToView("list");
              }}
            />
          ) : activeView === "list" ? (
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-bold text-2xl leading-tight">
                    Documents
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Find, review, and manage controlled quality documents.
                  </p>
                </div>

                <Dialog onOpenChange={setCreateOpen} open={createOpen}>
                  <DialogTrigger
                    onClick={() => setCreateOpen(true)}
                    render={<Button size="lg" />}
                  >
                    <PlusIcon aria-hidden="true" />
                    Create document
                  </DialogTrigger>
                  <DialogPopup className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Create a document</DialogTitle>
                      <DialogDescription>
                        Choose the lifecycle that applies. You can complete
                        metadata and routing in the next step.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogPanel>
                      <RadioGroup
                        aria-label="Document category"
                        onValueChange={(value) =>
                          setDocumentKind(String(value))
                        }
                        value={documentKind}
                      >
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-secondary/72 has-[[data-checked]]:border-primary/32 has-[[data-checked]]:bg-secondary">
                          <Radio value="controlled" />
                          <span className="flex flex-col gap-1">
                            <span className="font-medium text-sm">
                              Controlled document
                            </span>
                            <span className="text-muted-foreground text-sm">
                              Formal review, QA approval, version control, and
                              effective-date management.
                            </span>
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-secondary/72 has-[[data-checked]]:border-primary/32 has-[[data-checked]]:bg-secondary">
                          <Radio value="external" />
                          <span className="flex flex-col gap-1">
                            <span className="font-medium text-sm">
                              External document
                            </span>
                            <span className="text-muted-foreground text-sm">
                              Reference material originating outside the
                              organization.
                            </span>
                          </span>
                        </label>
                      </RadioGroup>
                    </DialogPanel>
                    <DialogFooter>
                      <DialogClose render={<Button variant="ghost" />}>
                        Cancel
                      </DialogClose>
                      <Button
                        onClick={() => {
                          setCreateOpen(false);
                          navigateToView("create");
                        }}
                      >
                        Continue
                        <ChevronRightIcon aria-hidden="true" />
                      </Button>
                    </DialogFooter>
                  </DialogPopup>
                </Dialog>
              </div>

              {notice && (
                <div
                  className="flex items-center gap-3 rounded-xl border bg-secondary/72 px-4 py-3 text-sm"
                  role="status"
                >
                  <FilePlus2Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary"
                  />
                  <span className="flex-1">{notice}</span>
                  <Button
                    aria-label="Dismiss message"
                    onClick={() => setNotice(null)}
                    size="icon-xs"
                    variant="ghost"
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </div>
              )}

              <section
                aria-label="Document filters"
                className="flex flex-col gap-3"
              >
                <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_180px_180px_220px]">
                  <InputGroup>
                    <InputGroupInput
                      aria-label="Search documents"
                      onChange={(event) => {
                        setQuery(event.target.value);
                        resetPage();
                      }}
                      placeholder="Search by name, ID, or author…"
                      type="search"
                      value={query}
                    />
                    <InputGroupAddon>
                      <SearchIcon aria-hidden="true" />
                    </InputGroupAddon>
                  </InputGroup>

                  <Select
                    items={statusOptions}
                    onValueChange={(value) => {
                      setStatus(String(value));
                      resetPage();
                    }}
                    value={status}
                  >
                    <SelectTrigger aria-label="Filter by status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>

                  <Select
                    items={typeOptions}
                    onValueChange={(value) => {
                      setType(String(value));
                      resetPage();
                    }}
                    value={type}
                  >
                    <SelectTrigger aria-label="Filter by document type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>

                  <Select
                    items={departmentOptions}
                    onValueChange={(value) => {
                      setDepartment(String(value));
                      resetPage();
                    }}
                    value={department}
                  >
                    <SelectTrigger aria-label="Filter by department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {departmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                </div>

                <div className="flex min-h-7 flex-wrap items-center gap-2 text-sm">
                  <SlidersHorizontalIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  <span className="text-muted-foreground">
                    {filteredDocuments.length}{" "}
                    {filteredDocuments.length === 1 ? "document" : "documents"}
                  </span>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} size="xs" variant="ghost">
                      Clear filters
                    </Button>
                  )}
                </div>
              </section>

              <section
                aria-label="Documents table"
                className="overflow-hidden rounded-xl border bg-card shadow-xs"
              >
                <Table>
                  <TableHeader className="bg-secondary/72">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[220px] ps-4 text-xs">
                        Document ID
                      </TableHead>
                      <TableHead className="min-w-[300px] text-xs">
                        Name
                      </TableHead>
                      <TableHead className="w-[148px] text-xs">
                        Status
                      </TableHead>
                      <TableHead className="w-[112px] text-xs max-[1180px]:hidden">
                        Version
                      </TableHead>
                      <TableHead className="w-[180px] text-xs max-[1320px]:hidden">
                        Department
                      </TableHead>
                      <TableHead className="w-[150px] text-xs max-[1460px]:hidden">
                        Author
                      </TableHead>
                      <TableHead className="w-[140px] text-xs max-[1180px]:hidden">
                        Effective date
                      </TableHead>
                      <TableHead className="w-12 pe-3 text-right text-xs">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleDocuments.length > 0 ? (
                      visibleDocuments.map((document) => (
                        <TableRow
                          key={`${document.id}-${document.version}`}
                          className="hover:bg-secondary/48"
                        >
                          <TableCell className="ps-4">
                            <span className="identifier text-muted-foreground text-xs">
                              {document.id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <button
                              className="max-w-[420px] truncate text-left font-medium text-foreground outline-none transition-colors hover:text-primary hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
                              onClick={() => openDocument(document)}
                              type="button"
                            >
                              {document.name}
                            </button>
                            <p className="mt-1 text-muted-foreground text-xs lg:hidden">
                              {document.department} · {document.version}
                            </p>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={document.status} />
                          </TableCell>
                          <TableCell className="max-[1180px]:hidden">
                            <span className="identifier">
                              {document.version}
                            </span>
                            <p className="mt-1 text-muted-foreground text-xs">
                              Current version
                            </p>
                          </TableCell>
                          <TableCell className="max-[1320px]:hidden">
                            {document.department}
                          </TableCell>
                          <TableCell className="max-[1460px]:hidden">
                            {document.author}
                          </TableCell>
                          <TableCell className="max-[1180px]:hidden">
                            {document.effectiveDate ?? "—"}
                          </TableCell>
                          <TableCell className="pe-3 text-right">
                            <Menu>
                              <MenuTrigger
                                render={
                                  <Button
                                    aria-label={`Actions for ${document.name}`}
                                    size="icon-sm"
                                    variant="ghost"
                                  />
                                }
                              >
                                <MoreHorizontalIcon aria-hidden="true" />
                              </MenuTrigger>
                              <MenuPopup align="end">
                                <MenuItem
                                  onClick={() => setSelectedDocument(document)}
                                >
                                  <FileTextIcon aria-hidden="true" />
                                  View details
                                </MenuItem>
                                <MenuItem>
                                  <FileClockIcon aria-hidden="true" />
                                  Version history
                                </MenuItem>
                                <MenuSeparator />
                                <MenuItem>
                                  <UserRoundIcon aria-hidden="true" />
                                  View owner
                                </MenuItem>
                              </MenuPopup>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="h-64 text-center" colSpan={8}>
                          <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                              <FileSearchIcon
                                aria-hidden="true"
                                className="size-5 text-muted-foreground"
                              />
                            </div>
                            <p className="font-medium">No documents found</p>
                            <p className="text-muted-foreground text-sm">
                              Adjust your search or clear the current filters.
                            </p>
                            <Button
                              className="mt-2"
                              onClick={clearFilters}
                              size="sm"
                              variant="outline"
                            >
                              Clear filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </section>

              <footer className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-muted-foreground text-sm">
                  <span className="shrink-0">Rows per page</span>
                  <Select
                    items={pageSizeOptions}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setPage(1);
                    }}
                    value={String(pageSize)}
                  >
                    <SelectTrigger
                      aria-label="Rows per page"
                      className="min-w-20"
                      size="sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {pageSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <span>{filteredDocuments.length} total</span>
                </div>

                <nav
                  aria-label="Document pages"
                  className="flex items-center gap-1"
                >
                  <Button
                    aria-label="Previous page"
                    disabled={safePage === 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    size="icon"
                    variant="outline"
                  >
                    <ChevronLeftIcon aria-hidden="true" />
                  </Button>
                  {Array.from(
                    { length: pageCount },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      aria-current={
                        safePage === pageNumber ? "page" : undefined
                      }
                      aria-label={`Page ${pageNumber}`}
                      onClick={() => setPage(pageNumber)}
                      size="icon"
                      variant={
                        safePage === pageNumber ? "secondary" : "outline"
                      }
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    aria-label="Next page"
                    disabled={safePage === pageCount}
                    onClick={() =>
                      setPage((value) => Math.min(pageCount, value + 1))
                    }
                    size="icon"
                    variant="outline"
                  >
                    <ChevronRightIcon aria-hidden="true" />
                  </Button>
                </nav>
              </footer>
            </div>
          ) : (
            <DocumentFlowScreen
              documentKind={documentKind}
              onBack={() => navigateToView("list")}
              onViewChange={navigateToView}
              view={activeView}
            />
          )}
        </main>
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) setSelectedDocument(null);
        }}
        open={selectedDocument !== null}
      >
        <DialogPopup className="sm:max-w-lg">
          {selectedDocument && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 pe-10">
                  <StatusBadge status={selectedDocument.status} />
                  <span className="identifier text-muted-foreground text-xs">
                    {selectedDocument.version}
                  </span>
                </div>
                <DialogTitle className="leading-tight">
                  {selectedDocument.name}
                </DialogTitle>
                <DialogDescription className="identifier">
                  {selectedDocument.id}
                </DialogDescription>
              </DialogHeader>
              <DialogPanel>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">Document type</dt>
                    <dd className="font-medium">{selectedDocument.type}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">Department</dt>
                    <dd className="font-medium">
                      {selectedDocument.department}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">Author</dt>
                    <dd className="font-medium">{selectedDocument.author}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">Effective date</dt>
                    <dd className="font-medium">
                      {selectedDocument.effectiveDate ?? "Not effective"}
                    </dd>
                  </div>
                </dl>
              </DialogPanel>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>
                  Close
                </DialogClose>
                <Button onClick={() => openDocument(selectedDocument)}>
                  Open document
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogPopup>
      </Dialog>
    </div>
  );
}
