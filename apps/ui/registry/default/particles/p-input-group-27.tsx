"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const handleCopy = () => {
    const content = textareaRef.current?.value || "";
    copyToClipboard(content);
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
          <SelectTrigger className="w-fit" size="sm">
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
                onClick={handleCopy}
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
