"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/registry/default/ui/button";
import { cn } from "@/lib/utils";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-2", className)} {...props}>
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Button
            data-pressed={active || undefined}
            key={item.href}
            render={
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(active && "text-primary")}
                href={item.href}
              />
            }
            variant="ghost"
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
