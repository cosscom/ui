import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import { RiArrowLeftLine } from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/registry/default/ui/button";

export const metadata: Metadata = {
  description:
    "The page you're looking for doesn't exist or may have been moved.",
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container w-full">
      <PageHeader>
        <PageHeaderHeading>Page Not Found</PageHeaderHeading>
        <PageHeaderDescription>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </PageHeaderDescription>
        <div className="mt-4">
          <Link className={buttonVariants({ className: "group" })} href="/">
            <RiArrowLeftLine
              aria-hidden="true"
              className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
            />
            Back to Home
          </Link>
        </div>
      </PageHeader>
    </div>
  );
}
