"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { Index } from "@/registry/__index__";
import { getCategorySortOrder } from "@/registry/registry-categories";
import SearchField from "./search-field";

const particles = Object.values(Index).filter(
  (item) => item.type === "registry:block",
);

const uniqueCategories = Array.from(
  new Set(particles.flatMap((particle) => particle.categories || [])),
).sort((a, b) => getCategorySortOrder(a) - getCategorySortOrder(b));

const searchItems = uniqueCategories.map((category) => ({
  label: category
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  value: category,
}));

export default function SearchContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedItems = useMemo(() => {
    const tags = searchParams?.get("tags")?.split(",").filter(Boolean) || [];
    return tags
      .map((tag) => searchItems.find((item) => item.value === tag))
      .filter((item): item is { label: string; value: string } => !!item);
  }, [searchParams]);

  const updateSelectedItems = useCallback(
    (items: { label: string; value: string }[]) => {
      startTransition(() => {
        const tags =
          items.length > 0 ? items.map((item) => item.value).join(",") : "";
        const newUrl = tags
          ? `${pathname}?tags=${encodeURIComponent(tags)}`
          : pathname;
        router.push(newUrl, { scroll: false });
      });
    },
    [router, pathname],
  );

  return (
    <div className="mt-2 w-full">
      <SearchField
        items={searchItems}
        onItemsChange={updateSelectedItems}
        selectedItems={selectedItems}
      />
    </div>
  );
}
