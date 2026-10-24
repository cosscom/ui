import type { ReactNode } from "react";

export type StudyCategory =
  | "Cal.com"
  | "Interfaces"
  | "Services"
  | "Documents"
  | "Workflows"
  | "Objects"
  | "Data"
  | "Typography"
  | "States"
  | "404"
  | "Primitives"
  | "Particles";

export type IllustrationStudy = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: StudyCategory;
  illustration: ReactNode;
  baseline?: boolean;
  selected?: boolean;
  revision?: boolean;
  review?: "reference" | "outside" | "partial";
  reviewNote?: string;
};
