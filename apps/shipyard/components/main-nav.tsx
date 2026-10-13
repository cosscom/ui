"use client";

import { Button } from "@coss/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const active = (href: string) =>
    !href.includes("#") && pathname.includes(href);

  return (
    <nav className={cn("items-center gap-2", className)} {...props}>
      {items.map((item) => (
        <Button
          data-pressed={active(item.href) || undefined}
          key={item.href}
          render={
            <Link
              className={cn(active(item.href) && "text-primary")}
              href={item.href}
            />
          }
          variant="ghost"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
