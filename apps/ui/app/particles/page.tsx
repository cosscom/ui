import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@coss/ui/shared/page-header";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/registry/default/ui/button";
import { isValidRegistryCategory } from "@/registry/registry-categories";
import { particles } from "@/registry/registry-particles";
import { ParticlesDisplay } from "./particles-display";
import SearchContainer from "./search-container";
import { PageHero } from "@/components/page-hero";
import { ParticlesBlueprint } from "@/components/particles-blueprint";

const particleCount = particles.length;

const description = `Discover ${particleCount} ready-to-use particles, the building blocks of your design system. Filter by category to find the perfect component for your project.`;

export const metadata: Metadata = {
  description,
  title: "Browse Particles - coss ui",
};

async function ParticlesDisplayServer({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>;
}) {
  const params = await searchParams;
  const rawCategories = params.tags?.split(",").filter(Boolean) || [];

  // Separate valid and invalid categories
  const validCategories = rawCategories.filter((category) =>
    isValidRegistryCategory(category),
  );
  const invalidCategories = rawCategories.filter(
    (category) => !isValidRegistryCategory(category),
  );

  // If there are invalid categories, show "no components found" message
  if (invalidCategories.length > 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">
          No particles found for the selected filters
        </p>
      </div>
    );
  }

  // If no valid categories, don't render anything
  if (validCategories.length === 0) return null;

  return <ParticlesDisplay selectedCategories={validCategories} />;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>;
}) {
  return (
    <>
      <PageHero illustration={<ParticlesBlueprint />}>
        <PageHeaderHeading>Browse Particles</PageHeaderHeading>
        <PageHeaderDescription className="max-w-lg text-pretty">
          {description}
        </PageHeaderDescription>
        <div className="mt-1 flex flex-wrap gap-2">
          <Button render={<Link href="#particles" />} size="lg">
            Explore {particleCount} particles
          </Button>
          <Button render={<Link href="/docs" />} size="lg" variant="outline">
            Read the docs
          </Button>
        </div>
      </PageHero>
      <div className="border-t pt-8 md:pt-12">
        <div className="container w-full scroll-mt-24" id="particles">
          <Suspense>
            <SearchContainer />
          </Suspense>
          <Suspense>
            <ParticlesDisplayServer searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
