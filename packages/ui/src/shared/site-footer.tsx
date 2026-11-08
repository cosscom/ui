export function SiteFooter() {
  const gatewayOrigin = process.env.NEXT_PUBLIC_COSS_URL || "https://coss.com";
  const gatewayHome = `${gatewayOrigin.replace(/\/$/, "")}/`;

  return (
    <footer className="relative mt-8 py-6 text-muted-foreground before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64">
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 z-50 before:absolute before:top-[-3.5px] before:-left-[11.5px] before:z-1 before:-ml-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs after:absolute after:top-[-3.5px] after:-right-[11.5px] after:z-1 after:-mr-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs dark:after:bg-clip-border dark:before:bg-clip-border"
      />
      <div className="container flex w-full items-center justify-center gap-2 px-4 sm:px-6">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            className="font-bold font-heading text-foreground [font-variation-settings:'GEOM'_50,'opsz'_32]"
            href={gatewayHome}
          >
            coss.com
          </a>{" "}
          – open source, open heart, open mind.
        </p>
      </div>
    </footer>
  );
}
