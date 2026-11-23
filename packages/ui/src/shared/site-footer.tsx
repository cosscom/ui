/** coss.com's pages worth knowing about, linked from the footer. */
const COSS_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/products/email", label: "Email API" },
  { href: "/products/sms", label: "SMS API" },
  { href: "/products/scheduling", label: "Scheduling API" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

export function SiteFooter() {
  const gatewayOrigin = (
    process.env.NEXT_PUBLIC_COSS_URL || "https://coss.com"
  ).replace(/\/$/, "");

  return (
    <footer className="relative mt-8 py-6 text-muted-foreground before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64">
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 z-50 before:absolute before:top-[-3.5px] before:-left-[11.5px] before:z-1 before:-ml-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs after:absolute after:top-[-3.5px] after:-right-[11.5px] after:z-1 after:-mr-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs dark:after:bg-clip-border dark:before:bg-clip-border"
      />
      <div className="container flex w-full flex-col items-center gap-3 px-4 text-center sm:px-6">
        <p className="text-balance">
          coss ui is free and open source, funded by{" "}
          <a
            className="font-bold font-heading text-foreground [font-variation-settings:'GEOM'_50,'opsz'_32]"
            href={`${gatewayOrigin}/`}
          >
            coss.com
          </a>
          : one API for email, SMS, scheduling and more.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
          <nav aria-label="coss.com">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {COSS_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    className="underline-offset-4 hover:text-foreground hover:underline"
                    href={`${gatewayOrigin}${link.href}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p>© {new Date().getFullYear()} coss.com</p>
        </div>
      </div>
    </footer>
  );
}
