"use client";

import { DownloadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { toastManager } from "@/registry/default/ui/toast";

export default function Particle() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress((prev) =>
        Math.min(99, prev + Math.round(Math.random() * 8 + 2)),
      );
    }, 300);

    return () => clearInterval(interval);
  }, [isGenerating]);

  async function handleDownload() {
    if (isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    const toastId = toastManager.add({
      actionProps: {
        children: "Cancel",
        onClick: () => abortControllerRef.current?.abort(),
      },
      description: "Your download will begin once ready.",
      title: "Generating report…",
      type: "loading",
    });

    try {
      await new Promise<string>((resolve, reject) => {
        const shouldSucceed = Math.random() > 0.2;
        const timeoutId = setTimeout(() => {
          if (shouldSucceed) {
            resolve("Report ready");
          } else {
            reject(new Error("Generation failed"));
          }
        }, 4000);

        abortControllerRef.current?.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject(new DOMException("Cancelled", "AbortError"));
        });
      });
      toastManager.update(toastId, {
        actionProps: undefined,
        description: "Your file is now downloading.",
        title: "Download started",
        type: "success",
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toastManager.update(toastId, {
          actionProps: undefined,
          description: "Report generation was cancelled.",
          title: "Cancelled",
          type: "info",
        });
      } else {
        toastManager.update(toastId, {
          actionProps: undefined,
          description: "Please try again later.",
          title: "Failed to generate report",
          type: "error",
        });
      }
    } finally {
      setIsGenerating(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  }

  return (
    <Button disabled={isGenerating} onClick={handleDownload} variant="outline">
      {isGenerating ? (
        <>
          Loading…{" "}
          <span className="tabular-nums">
            {progress.toString().padStart(2, "\u2007")}%
          </span>
        </>
      ) : (
        <>
          <DownloadIcon />
          Download
        </>
      )}
    </Button>
  );
}
