import { Separator } from "@coss/ui/components/separator";
import { SiteHeader as WorkspaceSiteHeader } from "@coss/ui/shared/site-header";
import { CommandMenu } from "@/components/command-menu";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { appConfig } from "@/lib/config";
import { source } from "@/lib/source";

// coss.com's bar with "shipyard" as the product, Docs and Download, the
// docs' search, and Shipyard's own repository behind the GitHub link.
export function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <WorkspaceSiteHeader
      currentProduct="shipyard"
      github={appConfig.github}
      mobileNav={
        <MobileNav
          className="flex lg:hidden"
          items={appConfig.navItems}
          tree={pageTree}
        />
      }
    >
      <MainNav className="hidden lg:flex" items={appConfig.navItems} />
      <div className="mx-2 hidden w-full flex-1 md:flex md:w-auto md:flex-none">
        <CommandMenu navItems={appConfig.navItems} tree={pageTree} />
      </div>
      <Separator className="h-5 max-md:hidden" orientation="vertical" />
    </WorkspaceSiteHeader>
  );
}
