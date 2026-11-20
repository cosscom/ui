"use client";

import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { useMemo } from "react";

type EventDescriptionProps = {
  description?: string | null;
};

const ALLOWED_TAGS = [
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "strong",
  "u",
  "ul",
];

const SAFE_URL_PATTERN =
  /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

function markdownToSafeHtml(description: string): string {
  const html = marked.parse(description, {
    async: false,
    breaks: true,
    gfm: true,
  }) as string;

  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ["href", "rel", "target", "title"],
    ALLOWED_TAGS,
    ALLOWED_URI_REGEXP: SAFE_URL_PATTERN,
  });
}

export function EventDescription({ description }: EventDescriptionProps) {
  const safeHtml = useMemo(() => {
    if (!description?.trim()) {
      return "";
    }

    return markdownToSafeHtml(description);
  }, [description]);

  if (!safeHtml) {
    return null;
  }

  return (
    <div
      className="text-muted-foreground text-sm [&_a:hover]:text-foreground [&_a]:underline [&_a]:not-hover:decoration-current/48 [&_a]:underline-offset-2 [&_blockquote]:border-s [&_blockquote]:ps-3 [&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_li]:ms-4 [&_ol]:list-decimal [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
