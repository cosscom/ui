import { buttonVariants } from "@coss/ui/components/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description:
    "The page you're looking for doesn't exist or may have been moved.",
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container mb-16 w-full flex-1 lg:mb-20">
      <PageHeader>
        <PageHeaderHeading>Page Not Found</PageHeaderHeading>
        <PageHeaderDescription>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </PageHeaderDescription>
        <div className="mt-4">
          <Link className={buttonVariants({ className: "group" })} href="/">
            <ArrowLeftIcon
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
