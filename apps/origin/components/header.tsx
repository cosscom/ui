"use client";

import { RiGithubFill, RiTwitterXFill } from "@remixicon/react";
import Link from "next/link";
import HeaderLink from "@/components/header-link";
import ThemeToggle from "@/components/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

const links = [{ href: "/easings", text: "Easing Classes" }];

export default function Header() {
  const isMobile = useIsMobile();
  const cossHomeUrl = process.env.NEXT_PUBLIC_COSS_URL || "";

  return (
    <header className="relative mb-14 before:absolute before:-inset-x-32 before:bottom-0 before:h-px before:bg-[linear-gradient(to_right,--theme(--color-border/.3),--theme(--color-border)_200px,--theme(--color-border)_calc(100%-200px),--theme(--color-border/.3))]">
      <div
        aria-hidden="true"
        className="before:absolute before:-bottom-px before:-left-12 before:z-10 before:-ml-px before:size-[3px] before:bg-ring/50 after:absolute after:-right-12 after:-bottom-px after:z-10 after:-mr-px after:size-[3px] after:bg-ring/50"
      />
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-3">
        <div className="-mt-0.5 flex shrink-0 items-start gap-1.5 font-heading text-2xl sm:text-[1.625em]">
          <a aria-label="Home" href={cossHomeUrl}>
            coss.com
          </a>
          <Link
            aria-label="Home"
            className="text-muted-foreground/72 hover:text-muted-foreground"
            href="/"
          >
            origin
          </Link>
        </div>
        <div className="flex items-center">
          {!isMobile && (
            <>
              <div className="flex items-center gap-4 md:gap-10">
                {links.map((link) => (
                  <HeaderLink
                    href={link.href}
                    key={link.href}
                    text={link.text}
                  />
                ))}
              </div>
              <div
                aria-hidden="true"
                className="ms-4 me-4 h-5 w-px bg-input md:ms-10"
              />
            </>
          )}
          <div className="flex items-center gap-1">
            <a
              className="inline-flex size-9 items-center justify-center rounded text-muted-foreground outline-none hover:text-foreground/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              href="https://x.com/coss_com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="sr-only">X</span>
              <RiTwitterXFill size={20} />
            </a>
            <a
              className="inline-flex size-9 items-center justify-center rounded text-muted-foreground outline-none hover:text-foreground/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              href="https://github.com/cosscom/ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="sr-only">GitHub</span>
              <RiGithubFill size={20} />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
