"use client";

import { buttonVariants } from "@coss/ui/components/button";
import { siteConfig } from "@coss/ui/lib/config";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type * as React from "react";

export function GitHubLinkClient({ stars }: { stars: React.ReactNode }) {
  return (
    <Link
      className={buttonVariants({
        className: "relative h-8 shadow-none max-sm:w-8",
        size: "sm",
        variant: "ghost",
      })}
      href={siteConfig.links.github}
      rel="noreferrer"
      target="_blank"
    >
      <HugeiconsIcon className="size-4" icon={GithubIcon} strokeWidth={2} />
      <span className="max-sm:sr-only">{stars}</span>
    </Link>
  );
}
