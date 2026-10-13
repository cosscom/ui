"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!activeId && itemIds?.length) {
      setActiveId(itemIds[0] ?? null);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" },
    );

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [itemIds, activeId]);

  return activeId;
}

export function DocsTableOfContents({
  toc,
  className,
}: {
  toc: {
    title?: React.ReactNode;
    url: string;
    depth: number;
  }[];
  className?: string;
}) {
  const itemIds = React.useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc],
  );
  const activeHeading = useActiveItem(itemIds);

  if (!toc?.length) return null;

  return (
    <div className={cn("flex flex-col gap-2 p-4 pt-0 text-sm", className)}>
      <p className="font-medium text-foreground">On this page</p>
      {toc.map((item) => (
        <a
          className={cn(
            "text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:text-foreground",
            item.depth === 3 && "ps-4",
            item.depth >= 4 && "ps-8",
          )}
          data-active={item.url === `#${activeHeading}`}
          href={item.url}
          key={item.url}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}
