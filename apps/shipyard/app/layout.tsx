import "./globals.css";

import { fontMono, fontSans } from "@coss/ui/fonts";
import { ThemeProvider } from "@coss/ui/shared/theme-provider";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { appConfig } from "@/lib/config";
import { inter, jetbrainsMono } from "@/lib/fonts";

export const metadata: Metadata = {
  description: appConfig.description,
  metadataBase: new URL("https://coss.com"),
  openGraph: {
    description: appConfig.description,
    siteName: "Shipyard",
    title: "Shipyard - coding agents on your own boxes",
    type: "website",
    url: appConfig.url,
  },
  title: {
    default: "Shipyard - coding agents on your own boxes",
    template: "%s - Shipyard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${inter.variable} ${jetbrainsMono.variable} relative bg-sidebar font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <div className="relative isolate flex min-h-svh flex-col overflow-clip [--header-height:4rem]">
            <div
              aria-hidden="true"
              className="container pointer-events-none absolute inset-0 z-45 before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:-right-3 after:w-px after:bg-border/64"
            />
            <div
              aria-hidden="true"
              className="container pointer-events-none fixed inset-x-0 top-0 z-45 h-(--header-height) before:absolute before:top-[calc(var(--header-height)-4.5px)] before:-left-[11.5px] before:z-1 before:-ml-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs/5 after:absolute after:top-[calc(var(--header-height)-4.5px)] after:-right-[11.5px] after:z-1 after:-mr-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs/5 dark:after:bg-clip-border dark:before:bg-clip-border"
            />
            <SiteHeader />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
