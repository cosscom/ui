import type { Metadata } from "next";
import { Suspense } from "react";
import ComponentsContainer from "./components-container";
import PageHeader from "@/components/page-header";
import { absoluteUrl } from "@/lib/canonical";

export const metadata: Metadata = {
  // Filtered views (?tags=…) are the same page.
  alternates: { canonical: absoluteUrl("/search") },
  description: "Search for components in the UI library.",
  title: "Search a UI component",
};

export default function Page() {
  return (
    <>
      <PageHeader className="mb-10" title="Search component">
        Use this page to quickly find a component (e.g., multiselect, vertical
        slider, etc.)
      </PageHeader>
      <Suspense>
        <ComponentsContainer />
      </Suspense>
    </>
  );
}
