import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/canonical";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/particles") },
    { url: absoluteUrl("/chat") },
    ...pages.map((page) => ({
      url: absoluteUrl(page.url),
    })),
  ];
}
