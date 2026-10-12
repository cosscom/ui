"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/registry/default/ui/button";
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
      {items.map((item) => (
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname.includes(item.href) && "text-primary",
          )}
          data-pressed={pathname.includes(item.href) || undefined}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
