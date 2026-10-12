import { buttonVariants } from "@coss/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { MobileHeader } from "@/components/mobile-header";
import { SettingsDrawer } from "@/components/settings/settings-drawer";

export function SettingsMobileHeader(): React.ReactElement {
  return (
    <MobileHeader>
      <Link
        aria-label="Back"
        className={buttonVariants({ variant: "ghost" })}
        href="/event-types"
      >
        <ArrowLeftIcon className="-ms-0.5" />
        <span>Back</span>
      </Link>
      <SettingsDrawer />
    </MobileHeader>
  );
}
