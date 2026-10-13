import { transformers } from "@coss/ui/lib/highlight-code";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";
import { rehypeNowrapTokens } from "./lib/rehype-nowrap-tokens";
import { rehypeReference } from "./lib/rehype-reference";

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        // biome-ignore lint/suspicious/noExplicitAny: known
        rehypePrettyCode as any,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ]);
      // Inline code wraps only between words, and the reference tables are
      // linkable (lib/rehype-reference.ts).
      plugins.push(rehypeNowrapTokens, rehypeReference);

      return plugins;
    },
  },
});

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema,
  },
});
