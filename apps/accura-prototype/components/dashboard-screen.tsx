"use client";

import { Badge } from "@coss/ui/components/badge";
import { Button } from "@coss/ui/components/button";
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
  CheckCircle as CheckCircleIcon,
  ClipboardCheck as ClipboardCheckIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  MultiplePages as FilesIcon,
  GraduationCap as GraduationCapIcon,
  RefreshDouble as RefreshCwIcon,
  Reports as ReportsIcon,
  WarningTriangle as WarningTriangleIcon,
} from "iconoir-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTab } from "./accura-tabs";

type DashboardScreenProps = {
  onOpenDocuments: () => void;
};

type RecordPriority = "High" | "Medium";

type ActionRecord = {
  description: string;
  dueDate: string;
  id: string;
  lateBy?: string;
  module: string;
  priority: RecordPriority;
  status: string;
  timeframe: "actions" | "upcoming";
};

const overviewModules = [
  {
    detail: "0 overdue · of 1 user",
    icon: GraduationCapIcon,
    metric: "0",
    name: "Training",
    status: "On track",
    tone: "success",
  },
  {
    detail: "due within 14 days · of 13 open",
    icon: ClipboardCheckIcon,
    metric: "0",
    name: "CAPA",
    status: "Overdue",
    tone: "danger",
  },
  {
    detail: "awaiting approval · of 18 in workflow",
    icon: FilesIcon,
    metric: "2",
    name: "Documents",
    status: "Due soon",
    tone: "warning",
  },
  {
    detail: "critical · of 14 open",
    icon: WarningTriangleIcon,
    metric: "1",
    name: "Non-Conformance",
    status: "Overdue",
    tone: "danger",
  },
  {
    detail: "due within 30 days · of 9 open",
    icon: RefreshCwIcon,
    metric: "1",
    name: "Change Control",
    status: "Overdue",
    tone: "danger",
  },
] as const;

const records: ActionRecord[] = [
  {
    description: "Test to reject at final stage",
    dueDate: "17 Sept",
    id: "ACME/CC/2026/000011",
    lateBy: "47 days late",
    module: "Change Control",
    priority: "High",
    status: "Implementation in Progress",
    timeframe: "actions",
  },
  {
    description: "Test to check reject",
    dueDate: "23 Sept",
    id: "ACME/CC/2026/000009",
    lateBy: "41 days late",
    module: "Change Control",
    priority: "High",
    status: "Impact Assessment",
    timeframe: "actions",
  },
  {
    description: "Test to reject change at final stage",
    dueDate: "30 Sept",
    id: "ACME/CC/2026/000010",
    lateBy: "34 days late",
    module: "Change Control",
    priority: "High",
    status: "Implementation in Progress",
    timeframe: "actions",
  },
  {
    description: "Document Review and Approval Form",
    dueDate: "2 Nov",
    id: "ACME-FRM-2026-000005",
    module: "Documents",
    priority: "Medium",
    status: "In Review",
    timeframe: "actions",
  },
  {
    description: "Equipment Cleaning Work Instruction",
    dueDate: "3 Nov",
    id: "ACME-WI-2026-000013",
    module: "Documents",
    priority: "High",
    status: "In QA Approval",
    timeframe: "actions",
  },
  {
    description: "Supplier corrective action follow-up",
    dueDate: "6 Nov",
    id: "ACME/CAPA/2026/000019",
    module: "CAPA",
    priority: "Medium",
    status: "In Review",
    timeframe: "upcoming",
  },
  {
    description: "Annual GMP refresher",
    dueDate: "9 Nov",
    id: "ACME/TRN/2026/000042",
    module: "Training",
    priority: "Medium",
    status: "Assigned",
    timeframe: "upcoming",
  },
];

const priorityOptions = [
  { label: "All priorities", value: "all" },
  { label: "High priority", value: "High" },
  { label: "Medium priority", value: "Medium" },
];

function ModuleStatus({ tone, value }: { tone: string; value: string }) {
  const variant = {
    danger: "destructive",
    success: "success",
    warning: "warning",
  }[tone] as "destructive" | "success" | "warning";

  return (
    <Badge size="sm" variant={variant}>
      {value}
    </Badge>
  );
}

export function DashboardScreen({ onOpenDocuments }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<"actions" | "upcoming">("actions");
  const [priority, setPriority] = useState("all");
  const [selectedModule, setSelectedModule] = useState("Documents");
  const recordsRef = useRef<HTMLElement>(null);

  const visibleRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          record.timeframe === activeTab &&
          (priority === "all" || record.priority === priority),
      ),
    [activeTab, priority],
  );

  const reviewActions = () => {
    setActiveTab("actions");
    setPriority("all");
    recordsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Tuesday, 3 November 2026
          </p>
          <h1 className="font-bold text-2xl leading-tight">
            Good morning, Amit
          </h1>
          <p className="text-muted-foreground text-sm">
            Here’s what needs your attention across Accura today.
          </p>
        </div>
        <Button onClick={reviewActions} variant="outline">
          <ClockIcon aria-hidden="true" />
          Review my actions
        </Button>
      </div>

      <section className="relative flex min-h-52 items-center overflow-hidden rounded-2xl border border-[var(--accura-brand-300)] bg-secondary px-6 py-8 shadow-sm sm:px-8">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover object-center"
          fill
          priority
          sizes="(max-width: 1600px) 100vw, 1600px"
          src="/brand/quality-workspace-banner.png"
        />
        <div className="relative z-1 flex max-w-[68%] flex-col gap-2 sm:max-w-xl">
          <p className="font-medium text-primary text-xs uppercase">
            Your quality workspace
          </p>
          <h2 className="font-bold text-3xl text-[var(--accura-brand-950-darkshade)] leading-[1.08] sm:text-4xl">
            Keep quality moving, without losing sight of risk.
          </h2>
        </div>
      </section>

      <div
        className="flex items-start gap-3 rounded-xl border border-[var(--accura-coral)]/32 bg-[var(--accura-coral)]/8 px-4 py-3 text-sm"
        role="status"
      >
        <WarningTriangleIcon
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-destructive"
        />
        <p>
          <span className="font-medium">Action required:</span> You have 18
          overdue records, 11 waiting on your sign-off, and 1 due this week.
        </p>
      </div>

      <section
        aria-labelledby="overview-heading"
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg" id="overview-heading">
              Overview
            </h2>
            <p className="text-muted-foreground text-sm">
              Live workload across your quality modules.
            </p>
          </div>
          <ReportsIcon
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {overviewModules.map((module) => {
            const Icon = module.icon;
            const selected = selectedModule === module.name;
            return (
              <button
                aria-pressed={selected}
                className={`relative min-h-28 overflow-hidden rounded-xl border bg-card p-4 text-left shadow-xs outline-none transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring ${
                  selected
                    ? "border-primary/56 ring-2 ring-primary/12"
                    : "border-border"
                }`}
                key={module.name}
                onClick={() => {
                  setSelectedModule(module.name);
                  if (module.name === "Documents") onOpenDocuments();
                }}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 ${
                    selected
                      ? "bg-primary"
                      : "bg-[var(--accura-pop)] opacity-72"
                  }`}
                />
                <span className="flex items-start justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary"
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="truncate font-medium">{module.name}</span>
                  </span>
                  <ModuleStatus tone={module.tone} value={module.status} />
                </span>
                <span className="mt-4 flex items-baseline gap-2">
                  <span className="identifier font-medium text-2xl">
                    {module.metric}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {module.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="records-heading"
        className="flex scroll-mt-24 flex-col gap-3"
        ref={recordsRef}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg" id="records-heading">
              Records
            </h2>
            <p className="text-muted-foreground text-sm">
              Prioritized work assigned to you.
            </p>
          </div>
          <Select
            items={priorityOptions}
            onValueChange={(value) => setPriority(String(value))}
            value={priority}
          >
            <SelectTrigger aria-label="Filter by priority" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>

        <Tabs
          onValueChange={(value) =>
            setActiveTab(value as "actions" | "upcoming")
          }
          value={activeTab}
        >
          <TabsList aria-label="Record views" className="px-0">
            <TabsTab value="actions">My actions (30)</TabsTab>
            <TabsTab value="upcoming">Upcoming (2)</TabsTab>
          </TabsList>
        </Tabs>

        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <Table>
            <TableHeader className="bg-secondary/72">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[300px] ps-4 text-xs">
                  Record
                </TableHead>
                <TableHead className="min-w-[190px] text-xs">Status</TableHead>
                <TableHead className="w-[120px] text-xs">Priority</TableHead>
                <TableHead className="w-[170px] text-xs max-[1120px]:hidden">
                  Module
                </TableHead>
                <TableHead className="w-[140px] text-xs">Due date</TableHead>
                <TableHead className="w-12 pe-3 text-right text-xs">
                  <span className="sr-only">View</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRecords.length > 0 ? (
                visibleRecords.map((record) => (
                  <TableRow className="hover:bg-secondary/48" key={record.id}>
                    <TableCell className="ps-4">
                      <button
                        className="identifier font-medium text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={
                          record.module === "Documents"
                            ? onOpenDocuments
                            : undefined
                        }
                        type="button"
                      >
                        {record.id}
                      </button>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {record.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge size="lg" variant="secondary">
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        variant={
                          record.priority === "High" ? "destructive" : "warning"
                        }
                      >
                        {record.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-[1120px]:hidden">
                      {record.module}
                    </TableCell>
                    <TableCell>
                      <span className="identifier text-sm">
                        {record.dueDate}
                      </span>
                      {record.lateBy && (
                        <p className="mt-1 text-destructive text-xs">
                          {record.lateBy}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="pe-3 text-right">
                      <Button
                        aria-label={`View ${record.id}`}
                        onClick={
                          record.module === "Documents"
                            ? onOpenDocuments
                            : undefined
                        }
                        size="icon-sm"
                        variant="ghost"
                      >
                        <EyeIcon aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-48 text-center" colSpan={6}>
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="size-8 text-primary"
                      />
                      <p className="font-medium">Nothing in this view</p>
                      <p className="text-muted-foreground text-sm">
                        Try another priority or switch record tabs.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
