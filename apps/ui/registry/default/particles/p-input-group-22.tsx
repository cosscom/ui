"use client";

import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/default/ui/input-group";

export default function Particle() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("Clear me");

  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Text input with clear button"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text"
        ref={inputRef}
        type="text"
        value={value}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <Button
            aria-label="Clear input"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            size="icon-xs"
            variant="ghost"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
