import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import { SiteFooter } from "@coss/ui/shared/site-footer";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/registry/default/ui/badge";
import { buttonVariants } from "@/registry/default/ui/button";
import {
  Card,
  CardFrame,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/registry/default/ui/card";
import { particles } from "@/registry/registry-particles";
import { getCategoryThumbnail } from "@/components/category-thumbnails";
import { categories } from "@/config/categories";
import { PAGES_NEW } from "@/lib/docs";

const description = "Built for developers and AI.";
const particleCount = particles.length;

export const metadata: Metadata = {
  description,
  title: "A new, modern UI component library built on top of Base UI - coss ui",
};

export default function Page() {
  return (
    <>
      <div className="container w-full">
        <PageHeader className="max-w-2xl *:items-start *:text-left">
          <PageHeaderHeading>
            A new, modern UI component library built on top of Base UI.
          </PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <div className="mt-2 flex gap-2">
            <Link className={buttonVariants({ size: "lg" })} href="/docs">
              Get started
            </Link>
            <Link
              className={buttonVariants({ size: "lg", variant: "outline" })}
              href="/particles"
            >
              Browse {particleCount} particles
            </Link>
          </div>
        </PageHeader>
      </div>
      <div className="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64">
        <div
          aria-hidden="true"
          className="container pointer-events-none absolute inset-0 z-50 before:absolute before:top-[-3.5px] before:-left-[11.5px] before:z-1 before:-ml-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs after:absolute after:top-[-3.5px] after:-right-[11.5px] after:z-1 after:-mr-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs dark:after:bg-clip-border dark:before:bg-clip-border"
        />
        <div className="container w-full">
          <div className="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                description={category.description}
                key={category.slug}
                name={category.name}
                slug={category.slug}
                thumbnail={getCategoryThumbnail(category.slug)}
              />
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

type CategoryCardProps = {
  slug: string;
  name: string;
  description?: string;
  thumbnail?: React.ReactNode;
};

function CategoryCard({
  slug,
  name,
  description,
  thumbnail,
}: CategoryCardProps) {
  const href = `/docs/components/${slug}`;
  const isNew = PAGES_NEW.includes(href);

  return (
    <CardFrame className="w-full after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/64">
      <CardFrameHeader className="static grid grid-rows-[auto_1fr]">
        <CardFrameTitle
          className="font-bold font-heading text-base [font-variation-settings:'GEOM'_50,'opsz'_32]"
          render={
            <h2>
              <Link className="before:absolute before:inset-0" href={href}>
                {name}
              </Link>
            </h2>
          }
        />
        <CardFrameDescription
          className="line-clamp-2 sm:h-[2lh]"
          render={<p />}
        >
          {description || "\u00A0"}
        </CardFrameDescription>
      </CardFrameHeader>
      <Card className="pointer-events-none min-h-55 flex-1 flex-col flex-wrap overflow-x-auto bg-[color-mix(in_srgb,var(--color-card),var(--color-sidebar))] dark:bg-background">
        {isNew && (
          <Badge className="absolute end-3 top-3" variant="info">
            New
          </Badge>
        )}
        <CardPanel className="flex flex-1 items-center justify-center px-8 [--border:--alpha(var(--color-black)/7%)] [--btn-from:--alpha(var(--color-primary)/90%)] [--btn-to:var(--color-primary)] in-[[data-slot=card-frame]:has(a:not(:hover))]:*:translate-y-0.5 *:transition-transform *:duration-200 dark:[--border:--alpha(var(--color-white)/3%)] dark:[--btn-from:var(--color-primary)] dark:[--btn-to:--alpha(var(--color-primary)/90%)]">
          {thumbnail}
        </CardPanel>
      </Card>
    </CardFrame>
  );
}
