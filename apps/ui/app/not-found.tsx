import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import { SiteFooter } from "@coss/ui/shared/site-footer";
import { RiArrowLeftLine } from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/registry/default/ui/button";
import { NotFoundBlueprint } from "@/components/not-found-blueprint";
import { NotFoundMotion } from "@/components/not-found-motion";

export const metadata: Metadata = {
  description:
    "The page you’re looking for doesn’t exist or may have been moved.",
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <>
      <section className="container flex w-full flex-1 flex-col items-center gap-5 py-10 text-center [font-optical-sizing:auto] [font-synthesis:none] md:py-14 lg:py-16">
        <div className="pointer-events-none w-full max-w-112 select-none lg:-my-12">
          <NotFoundMotion>
            <NotFoundBlueprint />
          </NotFoundMotion>
        </div>
        <PageHeaderHeading className="text-balance leading-[1.08] [font-variation-settings:'GEOM'_50]">
          Page Not Found
        </PageHeaderHeading>
        <PageHeaderDescription className="max-w-md text-pretty">
          The page you’re looking for doesn’t exist or may have been moved.
        </PageHeaderDescription>
        <div className="mt-1">
          <Button
            className="group"
            render={
              <Link href="/">
                <RiArrowLeftLine
                  aria-hidden="true"
                  className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                />
                Back to Home
              </Link>
            }
            size="lg"
          />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
