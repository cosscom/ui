"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef, useState } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const content = textareaRef.current?.value || "";
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InputGroup>
      <InputGroupTextarea
        className="font-mono"
        placeholder="Paste your code here…"
        ref={textareaRef}
        rows={6}
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
                aria-label={copied ? "Copied" : "Copy code"}
                onClick={handleCopy}
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </TooltipTrigger>
          <TooltipPopup>
            {copied ? "Copied!" : "Copy to clipboard"}
          </TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
