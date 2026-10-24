import type { IllustrationStudy } from "./study-types";

// The rejected codes are explicit user feedback; the short diagnoses are ours.
// Keep original codes intact.
const outsideDirection: Record<string, string> = {
  K01: "A tilted calendar object with bindings and page depth.",
  K04: "A pictorial calendar-and-ticket composition.",
  K05: "A booking-flow illustration built from literal icons.",
  I01: "Perspective and separated depth layers.",
  I02: "Complete screen mockups rather than a construction relationship.",
  D01: "A physical book with curved pages and depth.",
  D02: "A physical archive shown in perspective.",
  W01: "A physical bridge used as a metaphor.",
  O01: "A literal object, even though it is drawn in elevation.",
  O02: "A folded object with visible volume.",
  A01: "A landscape built from stacked depth layers.",
  A02: "A stack of records shown in perspective.",
  S02: "A large success pictogram rather than a construction study.",
};

// Preserve the critique separately from our response to it. Revisions still
// need the user's review; they are not new style references by default.
const revisionFeedback: Record<string, string> = {
  I04: "The browser had the same problem as the earlier keyboard. Revised as a deliberate close-up with quiet construction and dashed continuation.",
  I06: "Requested avatars and removal of the triangular bubble tails. Revised as rounded messages paired with circular avatars.",
  O03: "The keyboard felt incomplete. Revised as a deliberate cropped detail with staggered rows and subtler dashed lines.",
  O05: "Requested two or three folders instead of one. Revised as a family of three flat outlines.",
  E02: "The idea worked but felt bland and weak. Revised with a measured route and a more prominent missing link.",
  B01: "Questioned whether the metaphor accurately represented Cloudflare. Revised to keep the origin outside the edge and distinguish cache hits from misses.",
  B09: "The connector at owner_id felt cramped. Replaced the branching endpoint with a circular port and a short straight approach.",
  B02: "Requested a more conceptual Vercel study, then questioned its accuracy. Revised to show one selected preview promoted to production; the broadcast arcs are removed.",
  K06: "The week was not recognizable. Revised with weekday and time labels, plus a named interval.",
  K08: "The concept worked, but its meaning was unclear. Revised with named availability and meeting labels.",
  I03: "A good direction, but not a strong example. Revised to make the construction relationship more prominent.",
  W03: "The composition felt weak. Revised with a more substantial selection structure.",
  W02: "Did not read as a blueprint. Revised around route width, bend radius, and branch spacing; awaiting review.",
};

export function applyStudyDirection(
  study: IllustrationStudy,
): IllustrationStudy {
  if (study.code === "C03") {
    return {
      ...study,
      review: "partial",
      revision: true,
      selected: true,
      reviewNote:
        "Selected for the Particles page. The requested A + B + C revision adds an Open action to identity and visibility; awaiting review.",
    };
  }
  if (["P00", "E02"].includes(study.code)) {
    return {
      ...study,
      review: "reference",
      selected: true,
      reviewNote: `Selected for the ${study.code === "P00" ? "main" : "404"} page. This preview uses the lab’s independent drawing snapshot.`,
    };
  }
  if (study.code === "B04") {
    return {
      ...study,
      review: "reference",
      reviewNote:
        "Explicit user feedback: ‘love the Linear example.’ A service reference for aligned modules and meaningful time intervals.",
    };
  }
  if (study.code === "B03") {
    return {
      ...study,
      reviewNote:
        "The user said this Stripe example was okay and requested another focused more directly on what Stripe does.",
    };
  }
  const note = outsideDirection[study.code];
  if (note) return { ...study, review: "outside", reviewNote: note };

  // These were not individually rejected; their tilt conflicts with the new rule.
  if (study.code === "E03" || study.code === "E05") {
    return {
      ...study,
      review: "outside",
      reviewNote:
        "Set aside because its tilted form conflicts with the clarified flat-view rule; not individually reviewed.",
    };
  }
  const revisionNote = revisionFeedback[study.code];
  if (revisionNote) {
    return {
      ...study,
      review: "partial",
      reviewNote: revisionNote,
    };
  }
  if (study.category === "Primitives" || study.category === "Particles") {
    return {
      ...study,
      review: "reference",
      reviewNote:
        "Style reference: one plane, modular forms, and guides that explain their construction.",
    };
  }
  return study;
}
