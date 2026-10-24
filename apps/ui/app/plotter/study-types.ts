import type { ReactNode } from "react";

export type StudyCategory =
  | "Foundations"
  | "Interfaces"
  | "Scheduling"
  | "Services"
  | "Systems"
  | "Objects"
  | "Empty states";

export type IllustrationStudy = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: StudyCategory;
  illustration: ReactNode;
};
