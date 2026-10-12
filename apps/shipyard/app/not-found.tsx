import { Button } from "@coss/ui/components/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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
          <Button
            className="group"
            render={
              <Link href="/">
                <ArrowLeft
                  aria-hidden="true"
                  className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                />
                Back to Home
              </Link>
            }
            size="lg"
          />
        </div>
      </PageHeader>
    </div>
  );
}
