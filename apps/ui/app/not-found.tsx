import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/registry/default/ui/button";
import { NotFoundBlueprint } from "@/components/not-found-blueprint";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  description:
    "The page you’re looking for doesn’t exist or may have been moved.",
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <PageHero illustration={<NotFoundBlueprint />}>
      <PageHeaderHeading>Page Not Found</PageHeaderHeading>
      <PageHeaderDescription className="max-w-md text-pretty">
        The page you’re looking for doesn’t exist or may have been moved.
      </PageHeaderDescription>
      <div className="mt-1">
        <Button render={<Link href="/" />} size="lg">
          <ArrowLeftIcon aria-hidden="true" />
          Back to Home
        </Button>
      </div>
    </PageHero>
  );
}
