import localFont from "next/font/local";

// The landing page's own faces, as at berthd.app (SIL OFL, licences beside
// them in fonts/). The docs and the header use coss's.
export const inter = localFont({
  display: "swap",
  src: "../fonts/inter-latin-wght.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

export const jetbrainsMono = localFont({
  display: "swap",
  src: "../fonts/jetbrains-mono-latin-wght.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
});
