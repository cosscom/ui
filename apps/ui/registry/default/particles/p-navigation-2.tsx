"use client";

import { useState } from "react";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/default/ui/segmented-control";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#activity", label: "Activity" },
  { href: "#settings", label: "Settings" },
];

export default function Particle() {
  const [current, setCurrent] = useState("#overview");

  return (
    <SegmentedControl aria-label="Project sections" render={<nav />} size="sm">
      {links.map((link) => (
        <SegmentedControlItem
          key={link.href}
          render={
            // biome-ignore lint/a11y/useAnchorContent: SegmentedControlItem supplies the link content through the render prop.
            <a
              aria-current={link.href === current ? "page" : undefined}
              href={link.href}
              onClick={() => setCurrent(link.href)}
            />
          }
        >
          {link.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
