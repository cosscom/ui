import { appConfig } from "@/lib/config";

/**
 * A page's absolute URL on coss.com, exactly as the sitemap lists it: the
 * basePath included, no trailing slash. Pages use it as their canonical, so
 * copies of a page (query strings, preview deployments, raw Markdown) all
 * point search engines at one URL.
 */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? appConfig.url : `${appConfig.url}${path}`;
}
