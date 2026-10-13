"use client";

import { Button } from "@coss/ui/components/button";
import { siteConfig } from "@coss/ui/lib/config";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type * as React from "react";

export function GitHubLinkClient({
  stars,
  href = siteConfig.links.github,
}: {
  stars: React.ReactNode;
  href?: string;
}) {
  return (
    <Button
      className="relative h-8 shadow-none max-sm:w-8"
      render={
        <Link href={href} rel="noreferrer" target="_blank">
          <HugeiconsIcon className="size-4" icon={GithubIcon} strokeWidth={2} />
          <span className="max-sm:sr-only">{stars}</span>
        </Link>
      }
      size="sm"
      variant="ghost"
    />
  );
}
