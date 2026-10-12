"use client";

import { CodeIcon } from "lucide-react";
import { type JSX, useEffect, useState } from "react";
import type { RegistryItem } from "shadcn/registry";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import ComponentCli from "@/components/cli-commands";
import CodeBlock, { highlight } from "@/components/code-block";
import CopyButton from "@/components/copy-button";
import CopyRegistry from "@/components/copy-registry";
import OpenInV0 from "@/components/open-in-v0";
import { convertRegistryPaths } from "@/lib/utils";

export default function ComponentDetails({
  component,
}: {
  component: RegistryItem;
}) {
  const originUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://coss.com/origin";
  const [code, setCode] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<JSX.Element | null>(
    null,
  );

  useEffect(() => {
    const handleEmptyCode = () => {
      setCode("");
      setHighlightedCode(null);
    };

    const loadCode = async () => {
      try {
        const response = await fetch(`/origin/r/${component.name}.json`);
        if (!response.ok) {
          handleEmptyCode();
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          handleEmptyCode();
          return;
        }

        const data = await response.json();
        const codeContent = convertRegistryPaths(data.files[0].content) || "";
        setCode(codeContent);

        // Pre-highlight the code
        const highlighted = await highlight(codeContent, "tsx");
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Failed to load code:", error);
        handleEmptyCode();
      }
    };

    loadCode();
  }, [component.name]);

  return (
    <div className="absolute top-2 right-2 flex gap-1 peer-data-comp-loading:hidden">
      <CopyRegistry url={`${originUrl}/r/${component.name}.json`} />
      <OpenInV0 componentSource={`${originUrl}/r/${component.name}.json`} />
      <Dialog>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <DialogTrigger asChild>
                  <Button
                    className="text-muted-foreground/80 transition-none hover:bg-transparent hover:text-foreground disabled:opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 lg:group-focus-within/item:opacity-100"
                    size="icon"
                    variant="ghost"
                  >
                    <CodeIcon aria-hidden={true} size={16} />
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-muted-foreground text-xs">
              View code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-left">Installation</DialogTitle>
            <DialogDescription className="sr-only">
              Use the CLI to add components to your project
            </DialogDescription>
          </DialogHeader>
          <div className="min-w-0 space-y-5">
            <ComponentCli name={component.name} />
            <div className="space-y-4">
              <p className="font-semibold text-lg tracking-tight">Code</p>
              <div className="relative">
                {code === "" ? (
                  <p className="text-muted-foreground text-sm">
                    No code available. If you think this is an error, please{" "}
                    <a
                      className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                      href="https://github.com/cosscom/ui/issues"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      open an issue
                    </a>
                    .
                  </p>
                ) : (
                  <>
                    <CodeBlock
                      code={code}
                      lang="tsx"
                      preHighlighted={highlightedCode}
                    />
                    <CopyButton componentSource={code} />
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
