"use client";

import {
  type ColumnDef,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, PlaneTakeoffIcon } from "lucide-react";
import { cn } from "@/registry/default/lib/utils";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { CardFrame, CardFrameFooter } from "@/registry/default/ui/card";
import { Checkbox } from "@/registry/default/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/default/ui/pagination";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/default/ui/table";

type Flight = {
  id: string;
  flightCode: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  duration: string;
  status: "On Time" | "Delayed" | "Cancelled" | "Boarding";
  gate: string;
};

const getStatusColor = (status: Flight["status"]) => {
  switch (status) {
    case "On Time":
      return "bg-emerald-500";
    case "Delayed":
      return "bg-amber-500";
    case "Cancelled":
      return "bg-red-500";
    case "Boarding":
      return "bg-blue-500";
    default:
      return "bg-muted-foreground/64";
  }
};

const features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
});

const columns: ColumnDef<typeof features, Flight>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          aria-label="Select all rows"
          checked={isAllSelected}
          indeterminate={isSomeSelected && !isAllSelected}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      );
    },
    id: "select",
    size: 28,
  },
  {
    accessorKey: "flightCode",
    cell: ({ row }) => (
      <div className="font-medium font-mono text-muted-foreground">
        {row.getValue("flightCode")}
      </div>
    ),
    header: "Flight",
    size: 80,
  },
  {
    accessorKey: "departureTime",
    cell: ({ row }) => {
      const isCancelled = row.original.status === "Cancelled";
      const isDelayed = row.original.status === "Delayed";
      return (
        <div
          className={cn(
            "flex items-center gap-1.5 font-normal tabular-nums",
            isCancelled && "text-muted-foreground line-through opacity-50",
          )}
        >
          <div className={isDelayed ? "text-warning-foreground" : undefined}>
            {row.original.departureTime}
          </div>
          <div
            aria-hidden="true"
            className="flex items-center gap-0.5 opacity-50 before:size-1.5 before:rounded-full before:border before:border-muted-foreground after:h-px after:w-3 after:border-muted-foreground after:border-t after:border-dashed"
          />
          <div
            className={cn(
              "text-muted-foreground",
              isCancelled && "line-through",
            )}
          >
            {row.original.duration}
          </div>
          <div
            aria-hidden="true"
            className="flex items-center gap-0.5 opacity-50 before:order-1 before:size-1.5 before:rounded-full before:border before:border-muted-foreground after:h-px after:w-3 after:border-muted-foreground after:border-t after:border-dashed"
          />
          <div>{row.original.arrivalTime}</div>
        </div>
      );
    },
    header: "Time",
    size: 220,
  },
  {
    accessorKey: "destination",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("destination")}</div>
    ),
    header: "Destination",
    size: 180,
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Flight["status"];
      return (
        <Badge variant="outline">
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", getStatusColor(status))}
          />
          {status}
        </Badge>
      );
    },
    header: "Status",
    size: 120,
  },
  {
    accessorKey: "terminal",
    cell: ({ row }) => (
      <Badge className="font-normal tabular-nums" size="lg" variant="outline">
        <PlaneTakeoffIcon />
        <span>{row.getValue("terminal")}</span>
      </Badge>
    ),
    header: "Terminal",
    size: 90,
  },
  {
    accessorKey: "gate",
    header: "Gate",
    size: 80,
  },
];

export default function Particle() {
  const pageSize = 10;

  const table = useTable(
    {
      columns,
      data: flights,
      enableSortingRemoval: false,
      features,
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize,
        },
        sorting: [
          {
            desc: false,
            id: "departureTime",
          },
        ],
      },
    },
    (state) => ({
      pagination: state.pagination,
      rowSelection: state.rowSelection,
      sorting: state.sorting,
    }),
  );

  return (
    <CardFrame className="w-full">
      <Table variant="card" className="table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnSize = header.column.getSize();
                const sort = header.column.getIsSorted();
                return (
                  <TableHead
                    aria-sort={
                      sort === "asc"
                        ? "ascending"
                        : sort === "desc"
                          ? "descending"
                          : undefined
                    }
                    key={header.id}
                    style={
                      columnSize ? { width: `${columnSize}px` } : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex h-full cursor-pointer select-none items-center justify-between gap-2"
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <ChevronUpIcon
                              aria-hidden="true"
                              className="size-4 shrink-0 opacity-80"
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="size-4 shrink-0 opacity-80"
                            />
                          ),
                        }[sort as string] ?? null}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                data-state={row.getIsSelected() ? "selected" : undefined}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CardFrameFooter className="p-2">
        <div className="flex items-center justify-between gap-2">
          {/* Results range selector */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <p className="text-muted-foreground text-sm">Viewing</p>
            <Select
              items={Array.from({ length: table.getPageCount() }, (_, i) => {
                const start = i * table.state.pagination.pageSize + 1;
                const end = Math.min(
                  (i + 1) * table.state.pagination.pageSize,
                  table.getRowCount(),
                );
                const pageNum = i + 1;
                return { label: `${start}-${end}`, value: pageNum };
              })}
              onValueChange={(value) => {
                table.setPageIndex((value as number) - 1);
              }}
              value={table.state.pagination.pageIndex + 1}
            >
              <SelectTrigger
                aria-label="Select result range"
                className="w-fit min-w-none"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {Array.from({ length: table.getPageCount() }, (_, i) => {
                  const start = i * table.state.pagination.pageSize + 1;
                  const end = Math.min(
                    (i + 1) * table.state.pagination.pageSize,
                    table.getRowCount(),
                  );
                  const pageNum = i + 1;
                  return (
                    <SelectItem key={pageNum} value={pageNum}>
                      {`${start}-${end}`}
                    </SelectItem>
                  );
                })}
              </SelectPopup>
            </Select>
            <p className="text-muted-foreground text-sm">
              of{" "}
              <strong className="font-medium text-foreground">
                {table.getRowCount()}
              </strong>{" "}
              results
            </p>
          </div>

          {/* Pagination */}
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="sm:*:[svg]:hidden"
                  render={
                    <Button
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.previousPage()}
                      size="sm"
                      variant="outline"
                    />
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="sm:*:[svg]:hidden"
                  render={
                    <Button
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.nextPage()}
                      size="sm"
                      variant="outline"
                    />
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardFrameFooter>
    </CardFrame>
  );
}

const flights: Flight[] = [
  {
    arrivalTime: "11:45",
    departureTime: "08:30",
    destination: "Los Angeles",
    duration: "5h 15m",
    flightCode: "AA1234",
    gate: "A12",
    id: "1",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "17:10",
    departureTime: "14:20",
    destination: "San Francisco",
    duration: "4h 50m",
    flightCode: "DL5678",
    gate: "B24",
    id: "2",
    status: "Delayed",
    terminal: "2",
  },
  {
    arrivalTime: "13:30",
    departureTime: "10:15",
    destination: "Miami",
    duration: "3h 15m",
    flightCode: "UA9012",
    gate: "C8",
    id: "3",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "18:20",
    departureTime: "16:45",
    destination: "Seattle",
    duration: "2h 35m",
    flightCode: "SW3456",
    gate: "D15",
    id: "4",
    status: "On Time",
    terminal: "3",
  },
  {
    arrivalTime: "12:30",
    departureTime: "09:00",
    destination: "Salt Lake City",
    duration: "5h 30m",
    flightCode: "JB7890",
    gate: "E3",
    id: "5",
    status: "Cancelled",
    terminal: "2",
  },
  {
    arrivalTime: "14:15",
    departureTime: "11:30",
    destination: "Phoenix",
    duration: "2h 45m",
    flightCode: "AS2345",
    gate: "F7",
    id: "6",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "20:30",
    departureTime: "13:00",
    destination: "Las Vegas",
    duration: "5h 30m",
    flightCode: "HA6789",
    gate: "G12",
    id: "7",
    status: "Delayed",
    terminal: "2",
  },
  {
    arrivalTime: "09:00",
    departureTime: "07:15",
    destination: "Dallas",
    duration: "1h 45m",
    flightCode: "FX0123",
    gate: "H5",
    id: "8",
    status: "Boarding",
    terminal: "1",
  },
  {
    arrivalTime: "08:30",
    departureTime: "06:00",
    destination: "Denver",
    duration: "2h 30m",
    flightCode: "WN4567",
    gate: "I9",
    id: "9",
    status: "Boarding",
    terminal: "2",
  },
  {
    arrivalTime: "15:20",
    departureTime: "12:45",
    destination: "Portland",
    duration: "2h 35m",
    flightCode: "B61234",
    gate: "J14",
    id: "10",
    status: "On Time",
    terminal: "3",
  },
  {
    arrivalTime: "18:45",
    departureTime: "15:30",
    destination: "Atlanta",
    duration: "3h 15m",
    flightCode: "NK8901",
    gate: "K6",
    id: "11",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "12:00",
    departureTime: "09:45",
    destination: "Chicago",
    duration: "2h 15m",
    flightCode: "F92345",
    gate: "L11",
    id: "12",
    status: "Delayed",
    terminal: "2",
  },
  {
    arrivalTime: "14:15",
    departureTime: "11:00",
    destination: "Boston",
    duration: "3h 15m",
    flightCode: "SY6789",
    gate: "M3",
    id: "13",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "16:45",
    departureTime: "13:30",
    destination: "New York",
    duration: "3h 15m",
    flightCode: "G40123",
    gate: "N8",
    id: "14",
    status: "On Time",
    terminal: "3",
  },
  {
    arrivalTime: "11:20",
    departureTime: "08:00",
    destination: "Washington",
    duration: "3h 20m",
    flightCode: "YX5678",
    gate: "O12",
    id: "15",
    status: "Delayed",
    terminal: "2",
  },
  {
    arrivalTime: "13:50",
    departureTime: "10:30",
    destination: "Orlando",
    duration: "3h 20m",
    flightCode: "4U9012",
    gate: "P5",
    id: "16",
    status: "Delayed",
    terminal: "1",
  },
  {
    arrivalTime: "16:30",
    departureTime: "14:00",
    destination: "Houston",
    duration: "2h 30m",
    flightCode: "QF3456",
    gate: "Q9",
    id: "17",
    status: "On Time",
    terminal: "3",
  },
  {
    arrivalTime: "10:00",
    departureTime: "07:30",
    destination: "Minneapolis",
    duration: "2h 30m",
    flightCode: "LH7890",
    gate: "R7",
    id: "18",
    status: "Cancelled",
    terminal: "2",
  },
  {
    arrivalTime: "19:30",
    departureTime: "16:15",
    destination: "Detroit",
    duration: "3h 15m",
    flightCode: "KL2345",
    gate: "S4",
    id: "19",
    status: "Cancelled",
    terminal: "1",
  },
  {
    arrivalTime: "15:10",
    departureTime: "12:00",
    destination: "Philadelphia",
    duration: "3h 10m",
    flightCode: "AF6789",
    gate: "T16",
    id: "20",
    status: "On Time",
    terminal: "3",
  },
  {
    arrivalTime: "12:25",
    departureTime: "09:15",
    destination: "Charlotte",
    duration: "3h 10m",
    flightCode: "BA0123",
    gate: "U10",
    id: "21",
    status: "On Time",
    terminal: "2",
  },
  {
    arrivalTime: "18:00",
    departureTime: "15:45",
    destination: "Nashville",
    duration: "2h 15m",
    flightCode: "IB4567",
    gate: "V8",
    id: "22",
    status: "Delayed",
    terminal: "1",
  },
  {
    arrivalTime: "14:00",
    departureTime: "11:45",
    destination: "Austin",
    duration: "2h 15m",
    flightCode: "EK8901",
    gate: "W13",
    id: "23",
    status: "Cancelled",
    terminal: "3",
  },
  {
    arrivalTime: "16:40",
    departureTime: "13:15",
    destination: "Tampa",
    duration: "3h 25m",
    flightCode: "QR2345",
    gate: "X6",
    id: "24",
    status: "On Time",
    terminal: "2",
  },
  {
    arrivalTime: "11:30",
    departureTime: "08:45",
    destination: "Raleigh",
    duration: "2h 45m",
    flightCode: "TK6789",
    gate: "Y11",
    id: "25",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "12:45",
    departureTime: "10:00",
    destination: "Indianapolis",
    duration: "2h 45m",
    flightCode: "VS3456",
    gate: "Z4",
    id: "26",
    status: "On Time",
    terminal: "2",
  },
  {
    arrivalTime: "20:00",
    departureTime: "17:30",
    destination: "Kansas City",
    duration: "2h 30m",
    flightCode: "LX7890",
    gate: "A8",
    id: "27",
    status: "Delayed",
    terminal: "3",
  },
  {
    arrivalTime: "15:20",
    departureTime: "12:30",
    destination: "Columbus",
    duration: "2h 50m",
    flightCode: "OS1234",
    gate: "B19",
    id: "28",
    status: "On Time",
    terminal: "1",
  },
  {
    arrivalTime: "20:15",
    departureTime: "18:00",
    destination: "Milwaukee",
    duration: "2h 15m",
    flightCode: "SN5678",
    gate: "C22",
    id: "29",
    status: "On Time",
    terminal: "2",
  },
  {
    arrivalTime: "21:30",
    departureTime: "19:15",
    destination: "Memphis",
    duration: "2h 15m",
    flightCode: "TP9012",
    gate: "D6",
    id: "30",
    status: "On Time",
    terminal: "3",
  },
];
