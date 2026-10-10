import type { Registry } from "shadcn/schema";

export const hooks: Registry["items"] = [
  {
    dependencies: ["@base-ui/react"],
    files: [{ path: "hooks/use-composer-editor.ts", type: "registry:hook" }],
    name: "use-composer-editor",
    registryDependencies: ["@coss/composer-document"],
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "hooks/use-media-query.ts",
        type: "registry:hook",
      },
    ],
    name: "use-media-query",
    type: "registry:hook",
  },
  {
    files: [
      {
        path: "hooks/use-copy-to-clipboard.ts",
        type: "registry:hook",
      },
    ],
    name: "use-copy-to-clipboard",
    type: "registry:hook",
  },
];
