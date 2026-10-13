import Link from "next/link";
import { appConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-0.5">
      <p>
        <Link
          className="font-bold font-heading text-lg [font-variation-settings:'GEOM'_50,'opsz'_32]"
          href="/"
        >
          coss.com <span className="text-muted-foreground/72">shipyard</span>
        </Link>
      </p>
      <p className="text-muted-foreground text-sm">
        Coding agents on your own boxes. Free and{" "}
        <a
          className="font-medium underline-offset-4 hover:underline"
          href={appConfig.github.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          open source
        </a>
        , by the team of{" "}
        <a
          className="font-medium underline-offset-4 hover:underline"
          href="https://cal.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Cal.com
        </a>
        , Inc.
      </p>
    </footer>
  );
}
