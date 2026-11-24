import type { MetadataRoute } from "next";
import { categories } from "@/config/components";
import { absoluteUrl } from "@/lib/canonical";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: absoluteUrl("/"),
  };
  const search = {
    url: absoluteUrl("/search"),
  };
  const easings = {
    url: absoluteUrl("/easings"),
  };
  const categoryPages = categories.map((category) => ({
    url: absoluteUrl(`/${category.slug}`),
  }));

  return [home, ...categoryPages, search, easings];
}
