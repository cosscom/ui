import "./globals.css";

import { fontMono, fontSans } from "@coss/ui/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    process.env.NEXT_PUBLIC_ACCURA_DOCUMENTS_ONLY === "true"
      ? "Accura eQMS document management prototype"
      : "Accura eQMS workspace prototype",
  title:
    process.env.NEXT_PUBLIC_ACCURA_DOCUMENTS_ONLY === "true"
      ? "Documents · Accura"
      : "Accura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>
          {":where(svg[stroke-width]) { stroke-width: 2 !important; }"}
        </style>
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
