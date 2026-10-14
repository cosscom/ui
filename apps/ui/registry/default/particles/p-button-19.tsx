"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <Button className="gap-1" onClick={toggleExpand} variant="ghost">
      {isExpanded ? "Show less" : "Show more"}
      {isExpanded ? (
        <ChevronUpIcon aria-hidden="true" className="-me-1" />
      ) : (
        <ChevronDownIcon aria-hidden="true" className="-me-1" />
      )}
    </Button>
  );
}
