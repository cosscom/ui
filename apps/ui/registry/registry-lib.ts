import type { Registry } from "shadcn/schema";

export const lib: Registry["items"] = [
  {
    files: [{ path: "lib/composer-document.ts", type: "registry:lib" }],
    name: "composer-document",
    registryDependencies: ["@coss/composer-query"],
    type: "registry:lib",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [{ path: "lib/composer-editor.ts", type: "registry:lib" }],
    name: "composer-editor",
    registryDependencies: ["@coss/use-composer-editor"],
    type: "registry:lib",
  },
  {
    files: [{ path: "lib/composer-query.ts", type: "registry:lib" }],
    name: "composer-query",
    type: "registry:lib",
  },
  {
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "lib/segmented-control.ts",
        type: "registry:lib",
      },
    ],
    name: "segmented-control",
    type: "registry:lib",
  },
  {
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
    name: "utils",
    type: "registry:lib",
  },
];
