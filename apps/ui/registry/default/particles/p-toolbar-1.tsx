"use client";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  DollarSignIcon,
  PercentIcon,
} from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/default/ui/toggle-group";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/registry/default/ui/toolbar";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const items = [
  { label: "Helvetica", value: "helvetica" },
  { label: "Arial", value: "arial" },
  { label: "Times New Roman", value: "times-new-roman" },
];

export default function Particle() {
  return (
    <TooltipProvider>
      <Toolbar>
        <ToggleGroup className="border-none p-0" defaultValue={["left"]}>
          <Tooltip>
            <TooltipTrigger
              render={
                <ToolbarButton
                  aria-label="Align left"
                  render={<ToggleGroupItem value="left" />}
                >
                  <AlignLeftIcon />
                </ToolbarButton>
              }
            />
            <TooltipPopup sideOffset={8}>Align left</TooltipPopup>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <ToolbarButton
                  aria-label="Align center"
                  render={
                    <ToggleGroupItem
                      aria-label="Toggle center"
                      value="center"
                    />
                  }
                >
                  <AlignCenterIcon />
                </ToolbarButton>
              }
            />
            <TooltipPopup sideOffset={8}>Align center</TooltipPopup>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <ToolbarButton
                  aria-label="Align right"
                  render={
                    <ToggleGroupItem aria-label="Toggle right" value="right" />
                  }
                >
                  <AlignRightIcon />
                </ToolbarButton>
              }
            />
            <TooltipPopup sideOffset={8}>Align right</TooltipPopup>
          </Tooltip>
        </ToggleGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <Tooltip>
            <TooltipTrigger
              render={
                <ToolbarButton
                  aria-label="Format as currency"
                  render={<Button size="icon" variant="ghost" />}
                >
                  <DollarSignIcon />
                </ToolbarButton>
              }
            />
            <TooltipPopup sideOffset={8}>Format as currency</TooltipPopup>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <ToolbarButton
                  aria-label="Format as percent"
                  render={<Button size="icon" variant="ghost" />}
                >
                  <PercentIcon />
                </ToolbarButton>
              }
            />
            <TooltipPopup sideOffset={8}>Format as percent</TooltipPopup>
          </Tooltip>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <Select defaultValue="helvetica" items={items}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <ToolbarButton
                    render={
                      <SelectTrigger aria-label="Font">
                        <SelectValue />
                      </SelectTrigger>
                    }
                  />
                }
              />
              <TooltipPopup sideOffset={8}>
                Select a different font
              </TooltipPopup>
            </Tooltip>
            <SelectPopup>
              {items.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton render={<Button />}>Save</ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </TooltipProvider>
  );
}
