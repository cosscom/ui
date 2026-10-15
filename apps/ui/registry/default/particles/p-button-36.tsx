"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button onClick={() => copyToClipboard("Text copied!")} variant="outline">
      {isCopied ? (
        <>
          <CheckIcon aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <CopyIcon aria-hidden="true" />
          Copy
        </>
      )}
    </Button>
  );
}
