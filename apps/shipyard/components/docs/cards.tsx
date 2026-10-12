import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A grid of linked cards, the way the docs' introduction lays out the path
// through getting started (.berth-path numbers them).
export function Cards({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("my-6 grid gap-3 sm:grid-cols-2", className)}>
      {children}
    </div>
  );
}

export function Card({
  title,
  description,
  href,
  icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  href: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      className="block rounded-xl border bg-card p-4 no-underline shadow-xs/5 transition-colors hover:bg-accent/50"
      data-card
      href={href}
    >
      {icon && (
        <span className="mb-2 block text-muted-foreground [&_svg]:size-4.5">
          {icon}
        </span>
      )}
      <p className="font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      )}
    </Link>
  );
}
