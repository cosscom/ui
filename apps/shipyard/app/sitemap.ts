import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  return [
    { url: appConfig.url },
    ...pages.map((page) => ({
      url: `${appConfig.url}${page.url}`,
    })),
  ];
}
