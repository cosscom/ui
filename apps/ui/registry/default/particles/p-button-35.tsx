"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
      onClick={() => copyToClipboard("Text copied!")}
      size="icon"
      variant="outline"
    >
      {isCopied ? (
        <CheckIcon aria-hidden="true" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}
    </Button>
  );
}
