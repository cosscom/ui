import type { Registry } from "shadcn/schema";
import { baseUi } from "@/registry/registry-base-ui";
import { blocks } from "@/registry/registry-blocks";
import { fonts } from "@/registry/registry-fonts";
import { hooks } from "@/registry/registry-hooks";
import { lib } from "@/registry/registry-lib";
import { particles } from "@/registry/registry-particles";
import { styles } from "@/registry/registry-styles";
import { ui } from "@/registry/registry-ui";

export const registry = {
  homepage: "https://coss.com",
  items: [
    ...ui,
    ...blocks,
    ...(particles as Registry["items"]),
    ...styles,
    ...fonts,
    ...lib,
    ...baseUi,
    ...hooks,
  ],
  name: "coss ui",
} satisfies Registry;
