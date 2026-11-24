// Event descriptions as Cal's own Booker renders them: a copy of the browser
// path of Cal's markdown adapter (calcom/cal `packages/infra/adapters/markdown`:
// `markdown-it.ts`, `merge-split-nested-lists.ts`, and `toProseHtml` in
// `dompurify-markdown-adapter.ts`). API v2 returns the description as raw
// markdown, which may contain raw HTML, so it is sanitized here.

import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt("default", {
  breaks: true,
  html: true,
  linkify: true,
});

// The description editor serializes a nested list as a sibling `<li><ul>…</ul></li>`.
// Match: <li>Some text </li><li><ul>...</ul></li>
// Convert to: <li>Some text <ul>...</ul></li>
function mergeSplitNestedLists(html: string): string {
  return html.replace(
    /<li>([^<]+|<strong>.*?<\/strong>)<\/li>\s*<li>\s*<ul([^>]*)>([\s\S]*?)<\/ul>\s*<\/li>/g,
    "<li>$1<ul$2>$3</ul></li>",
  );
}

/**
 * Sanitized HTML for a styled container: no inline styles or link classes.
 * Without a DOM (a server render) DOMPurify cannot sanitize, so this returns
 * an empty string; call it in the browser.
 */
export function markdownToSafeHtml(markdown: string | null): string {
  if (!markdown || !DOMPurify.isSupported) return "";

  const fragment = DOMPurify.sanitize(md.render(markdown), {
    RETURN_DOM_FRAGMENT: true,
  });
  for (const anchor of fragment.querySelectorAll("a")) {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer nofollow ugc");
  }
  const container = document.createElement("div");
  container.appendChild(fragment);

  return mergeSplitNestedLists(container.innerHTML);
}
