/** Where this app is served in production (its basePath on coss.com). */
export const SITE_URL = "https://coss.com/origin";

/**
 * A page's absolute URL on coss.com, exactly as the sitemap lists it: the
 * basePath included, no trailing slash. Pages use it as their canonical, so
 * copies of a page (query strings, preview deployments) all point search
 * engines at one URL.
 */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
