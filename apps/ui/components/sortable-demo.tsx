"use client";

import { GripVerticalIcon } from "lucide-react";
import { useState } from "react";
import {
  type SortableValue,
  useSortable,
} from "@/registry/default/hooks/use-sortable";
import { Badge } from "@/registry/default/ui/badge";

type Task = { id: string; title: string };

const itemClassName =
  "flex cursor-grab items-center gap-2 rounded-lg border bg-card px-3 py-2 text-card-foreground text-sm shadow-xs/5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-dragging:opacity-50 aria-pressed:data-drop-refused:border-destructive/64";

const overlayClassName =
  "z-50 flex cursor-grabbing items-center gap-2 rounded-lg border bg-card px-3 py-2 text-card-foreground text-sm shadow-lg data-drop-refused:border-destructive/64";

const steps = [
  "Draft the brief",
  "Review the designs",
  "Build the page",
  "Ship it",
];

const columns = [
  { id: "todo", label: "To do", limit: undefined },
  { id: "doing", label: "In progress", limit: 2 },
  { id: "done", label: "Done", limit: undefined },
];

const initialBoard: SortableValue<Task> = {
  doing: [{ id: "t4", title: "Write release notes" }],
  done: [{ id: "t5", title: "Set up analytics" }],
  todo: [
    { id: "t1", title: "Update pricing page" },
    { id: "t2", title: "Fix signup email" },
    { id: "t3", title: "Plan onboarding call" },
  ],
};

export function SortableListDemo() {
  const sortable = useSortable({
    defaultValue: { steps },
    getContainerLabel: () => "the list",
  });

  return (
    <div className="my-8">
      <div
        className="flex max-w-sm flex-col gap-2"
        {...sortable.getContainerProps("steps")}
      >
        {sortable.value.steps?.map((step) => (
          <div
            className={itemClassName}
            key={step}
            {...sortable.getItemProps(step)}
          >
            <GripVerticalIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            {step}
          </div>
        ))}
      </div>
      {sortable.active?.reason === "pointer" && (
        <div className={overlayClassName} {...sortable.getOverlayProps()}>
          <GripVerticalIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          {sortable.active.item}
        </div>
      )}
      <div {...sortable.getAnnouncerProps()} />
    </div>
  );
}

export function SortableBoardDemo() {
  const [board, setBoard] = useState(initialBoard);
  const sortable = useSortable({
    canMove: ({ from, to }) => {
      const limit = columns.find((column) => column.id === to.container)?.limit;
      if (!limit || from.container === to.container) return true;
      return (board[to.container]?.length ?? 0) < limit;
    },
    getContainerLabel: (id) =>
      columns.find((column) => column.id === id)?.label ?? id,
    getItemLabel: (task) => task.title,
    onValueChange: setBoard,
    value: board,
  });

  return (
    <div className="my-8 overflow-x-auto">
      <div className="grid min-w-[36rem] grid-cols-3 gap-3">
        {columns.map((column) => {
          const tasks = sortable.value[column.id] ?? [];
          return (
            <div
              className="flex flex-col gap-2 rounded-xl bg-muted/72 p-2 transition-colors data-drop-refused:bg-destructive/8 data-drop-refused:ring-1 data-drop-refused:ring-destructive/48"
              key={column.id}
              {...sortable.getContainerProps(column.id)}
            >
              <div className="flex items-center justify-between px-1 font-medium text-sm">
                {column.label}
                <Badge variant="outline">
                  {column.limit
                    ? `${tasks.length}/${column.limit}`
                    : tasks.length}
                </Badge>
              </div>
              <div className="flex min-h-24 flex-col gap-2">
                {tasks.map((task) => (
                  <div
                    className={itemClassName}
                    key={task.id}
                    {...sortable.getItemProps(task)}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {sortable.active?.reason === "pointer" && (
        <div className={overlayClassName} {...sortable.getOverlayProps()}>
          {sortable.active.item.title}
        </div>
      )}
      <div {...sortable.getAnnouncerProps()} />
    </div>
  );
}
