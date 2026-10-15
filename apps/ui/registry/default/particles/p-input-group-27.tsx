"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/registry/default/ui/input-group";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];

export default function Particle() {
  const [code, setCode] = useState("");
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <InputGroup>
      <InputGroupTextarea
        className="font-mono"
        onChange={(event) => setCode(event.target.value)}
        placeholder="Paste your code here…"
        rows={6}
        value={code}
      />
      <InputGroupAddon
        align="block-start"
        className="justify-between rounded-t-lg border-b bg-muted/72 p-2!"
      >
        <Select defaultValue="javascript" items={languages}>
          <SelectTrigger aria-label="Code language" className="w-fit" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {languages.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label={isCopied ? "Copied" : "Copy code"}
                disabled={!code}
                onClick={() => copyToClipboard(code)}
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </TooltipTrigger>
          <TooltipPopup>
            {isCopied ? "Copied!" : "Copy to clipboard"}
          </TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
