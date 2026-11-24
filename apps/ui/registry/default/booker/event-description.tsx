"use client";

import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { useMemo } from "react";
import { ScrollArea } from "@/registry/default/ui/scroll-area";

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

  // As the design system's EventDescription in its EventDescriptionViewport:
  // the description scrolls past 180px.
  return (
    <ScrollArea
      aria-label="Event description"
      className="max-h-[180px] max-w-full"
      scrollFade
    >
      <div className="wrap-break-word pr-4">
        <div
          className="flex flex-col gap-2 text-muted-foreground text-sm [&_a:hover]:text-foreground [&_a]:underline [&_a]:not-hover:decoration-current/48 [&_a]:underline-offset-2 [&_blockquote]:border-s [&_blockquote]:ps-3 [&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_em]:italic [&_h1]:font-semibold [&_h1]:text-base [&_h1]:text-foreground [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:text-sm [&_li]:ms-4 [&_ol]:list-decimal [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </ScrollArea>
  );
}
