import { siteConfig } from "@coss/ui/lib/config";
import { GitHubLink } from "@coss/ui/shared/github-link";
import { ModeSwitcher } from "@coss/ui/shared/mode-switcher";
import { ProductLabel } from "@coss/ui/shared/product-label";
import Link from "next/link";

export function SiteHeader({
  mobileNav,
  children,
  actions,
  currentProduct,
  github,
}: {
  mobileNav?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  currentProduct?: string;
  /** The product's own repository for the GitHub link and its stars. */
  github?: { repo: string; href: string };
}) {
  const gatewayOrigin = process.env.NEXT_PUBLIC_COSS_URL || "";
  const gatewayHome = gatewayOrigin ? `${gatewayOrigin}/` : "/";
  const isExternal = !!gatewayOrigin;

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64">
      <div className="container relative flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6">
        {mobileNav}
        <div className="flex shrink-0 items-center gap-1.5 font-bold font-heading text-[1.375em] [font-variation-settings:'GEOM'_50,'opsz'_32] sm:text-2xl">
          {isExternal ? (
            <a aria-label="Home" href={gatewayHome}>
              coss.com
            </a>
          ) : (
            <Link aria-label="Home" href={gatewayHome}>
              coss.com
            </Link>
          )}
          <ProductLabel
            currentProduct={currentProduct}
            items={siteConfig.products}
          />
        </div>
        <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {children}
          <GitHubLink {...github} />
          {actions}
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
