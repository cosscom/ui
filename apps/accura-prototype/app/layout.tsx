import "./globals.css";

import { fontMono, fontSans } from "@coss/ui/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Accura eQMS document management prototype",
  title: "Documents · Accura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
