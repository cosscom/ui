"use client";

import { Button } from "@/registry/default/ui/button";
import { toastManager } from "@/registry/default/ui/toast";

export default function Particle() {
  return (
    <Button
      onClick={async () => {
        try {
          await toastManager.promise(
            new Promise<string>((resolve, reject) => {
              const shouldSucceed = Math.random() > 0.3;
              setTimeout(() => {
                if (shouldSucceed) {
                  resolve("Data loaded successfully");
                } else {
                  reject(new Error("Failed to load data"));
                }
              }, 2000);
            }),
            {
              error: () => ({
                description: "Please try again.",
                title: "Something went wrong",
              }),
              loading: {
                description: "The promise is loading.",
                title: "Loading…",
              },
              success: (data: string) => ({
                description: `Success: ${data}`,
                title: "This is a success toast!",
              }),
            },
          );
        } catch {
          // The promise toast already presents the failure.
        }
      }}
      variant="outline"
    >
      Run Promise
    </Button>
  );
}
