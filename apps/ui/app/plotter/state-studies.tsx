import {
  MissingDestinationBlueprint,
  MissingDestinationCompact,
} from "./missing-destination";
import type { IllustrationStudy } from "./study-types";

export const stateStudies: IllustrationStudy[] = [
  {
    id: "state-missing-page",
    code: "S01",
    title: "The missing destination",
    description:
      "A paired route reaches a closed end one unit before an unbuilt page. The address remains projected, but the connection is absent.",
    category: "Empty states",
    illustration: <MissingDestinationBlueprint />,
    emptyState: {
      title: "Page not found",
      description: "The page may have moved or no longer exists.",
      illustration: <MissingDestinationCompact />,
    },
  },
];
