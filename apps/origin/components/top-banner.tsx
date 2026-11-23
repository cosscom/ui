import { ArrowUpRightIcon } from "lucide-react";

export default function TopBanner() {
  const gatewayOrigin = process.env.NEXT_PUBLIC_COSS_UI_URL || "";
  // No trailing slash: coss.com/ui/ redirects to coss.com/ui, the canonical.
  const gatewayHome = gatewayOrigin ? gatewayOrigin.replace(/\/$/, "") : "/";

  return (
    <div className="dark relative bg-zinc-900 px-4 text-foreground/80">
      <p className="mx-auto w-full max-w-6xl py-3 text-sm">
        A new, modern UI component library built on top of Base UI. Explore the
        new{" "}
        <a
          className="group font-heading text-base text-foreground before:absolute before:inset-0 hover:underline"
          href={gatewayHome}
        >
          <span className="inline-flex items-center gap-1">
            <span className="decoration-muted-foreground underline-offset-4 group-hover:underline">
              coss.com <span className="text-muted-foreground">ui</span>
            </span>{" "}
            <ArrowUpRightIcon className="size-4 opacity-60 transition-all group-hover:rotate-45 group-hover:opacity-100" />
          </span>
        </a>
      </p>
    </div>
  );
}
