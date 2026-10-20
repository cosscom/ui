"use client";

import { useState } from "react";
import {
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from "@/registry/default/lib/segmented-control";
import { SegmentedControlIndicator } from "@/registry/default/lib/segmented-control-indicator";

const itemClassName = segmentedControlItemVariants({
  size: "sm",
  state: "current",
});

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#activity", label: "Activity" },
  { href: "#settings", label: "Settings" },
];

export default function Particle() {
  const [current, setCurrent] = useState(links[0].href);

  return (
    <nav aria-label="Project sections">
      <div className={segmentedControlRootClassName}>
        {links.map((link) => (
          <a
            aria-current={link.href === current ? "page" : undefined}
            className={itemClassName}
            href={link.href}
            key={link.href}
            onClick={(event) => {
              event.preventDefault();
              setCurrent(link.href);
            }}
          >
            {link.label}
          </a>
        ))}
        <SegmentedControlIndicator />
      </div>
    </nav>
  );
}
