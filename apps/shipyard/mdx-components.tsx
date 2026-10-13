import { ScrollArea } from "@coss/ui/components/scroll-area";
import { CopyButton } from "@coss/ui/shared/copy-button";
import { getIconForLanguageExtension } from "@coss/ui/shared/icons";
import { BookOpen, Compass, FileCode, Terminal } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { Callout } from "@/components/docs/callout";
import { Card, Cards } from "@/components/docs/cards";
import {
  Diagram,
  DiagramEdge,
  DiagramGroup,
  DiagramNode,
} from "@/components/docs/diagram";
import { Scene } from "@/components/docs/scenes";
import { Shot } from "@/components/docs/shot";
import { Stage } from "@/components/docs/stage";
import { cn } from "@/lib/utils";

const headingId = (
  props: { id?: string },
  children: React.ReactNode,
): string | undefined =>
  props.id ||
  children
    ?.toString()
    .replace(/ /g, "-")
    .replace(/'/g, "")
    .replace(/\?/g, "")
    .toLowerCase();

// coss ui's docs typography, with Shipyard's own pieces (components/docs).
// A link into the docs goes through next/link, so it keeps the site's base
// path.
export const mdxComponents = {
  a: ({ className, href, ...props }: React.ComponentProps<"a">) => {
    const classes = cn(
      "font-medium text-foreground underline underline-offset-4",
      className,
    );
    if (href?.startsWith("/")) {
      return <Link className={classes} href={href} {...props} />;
    }
    return <a className={classes} href={href} {...props} />;
  },
  // A few icons for Card's icon prop.
  BookOpen,
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 ps-6 italic", className)}
      {...props}
    />
  ),
  Callout,
  Card,
  Cards,
  Compass,
  code: ({
    className,
    __raw__,
    __src__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string;
    __src__?: string;
  }) => {
    // Inline Code.
    if (typeof props.children === "string") {
      return (
        <code
          className={cn(
            "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem] text-muted-foreground outline-none",
            className,
          )}
          {...props}
        />
      );
    }

    // Default codeblock.
    return (
      <>
        {__raw__ && <CopyButton src={__src__} value={__raw__} />}
        <code {...props} />
      </>
    );
  },
  Diagram,
  DiagramEdge,
  DiagramGroup,
  DiagramNode,
  FileCode,
  figcaption: ({
    className,
    children,
    ...props
  }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null;

    return (
      <figcaption
        className={cn(
          "flex items-center gap-2 text-[.8125rem] text-code-foreground [&_svg]:size-4.5 [&_svg]:text-code-foreground [&_svg]:opacity-70 sm:[&_svg]:size-4",
          className,
        )}
        {...props}
      >
        {iconExtension}
        {children}
      </figcaption>
    );
  },
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => {
    return <figure className={cn(className)} {...props} />;
  },
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 font-heading font-semibold text-3xl",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, children, ...props }: React.ComponentProps<"h2">) => {
    const id = headingId(props, children);
    return (
      <h2
        {...props}
        className={cn(
          "mt-12 scroll-m-20 font-heading font-semibold text-2xl first:mt-0 lg:mt-16 [&+p]:mt-4! *:[code]:text-2xl",
          className,
        )}
        id={id}
      >
        <a
          className="no-underline underline-offset-4 hover:underline"
          href={`#${id}`}
        >
          {children}
        </a>
      </h2>
    );
  },
  h3: ({ className, children, ...props }: React.ComponentProps<"h3">) => {
    const id = headingId(props, children);
    return (
      <h3
        {...props}
        className={cn(
          "mt-8 scroll-m-20 font-semibold text-lg *:[code]:text-lg",
          className,
        )}
        id={id}
      >
        <a
          className="no-underline underline-offset-4 hover:underline"
          href={`#${id}`}
        >
          {children}
        </a>
      </h3>
    );
  },
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn("mt-8 scroll-m-20 font-medium tracking-tight", className)}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 font-medium text-lg tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 font-medium text-base tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    <img alt={alt} className={cn("rounded-md", className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={cn("my-6 ms-6 list-decimal text-muted-foreground", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn(
        "not-first:mt-6 text-muted-foreground leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => {
    return (
      <ScrollArea className="**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2 **:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2">
        <pre
          className={cn(
            "w-max min-w-full px-4 py-3.5 text-[.8125rem] outline-none has-data-[slot=tabs]:p-0 has-data-highlighted-line:px-0 has-data-line-numbers:px-0",
            className,
          )}
          {...props}
        >
          {children}
        </pre>
      </ScrollArea>
    );
  },
  Scene,
  Shot,
  Stage,
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  ),
  Terminal,
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <ScrollArea className="my-6" scrollbarGutter>
      <table
        className={cn("relative w-full border-none text-sm", className)}
        {...props}
      />
    </ScrollArea>
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "px-4 py-2 text-left align-top [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "px-4 py-2 text-left font-medium [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr
      className={cn("m-0 border-b last:border-b-none", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={cn("my-6 ms-6 list-disc text-muted-foreground", className)}
      {...props}
    />
  ),
};
