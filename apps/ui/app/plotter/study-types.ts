import type { ReactNode } from "react";

export type StudyCategory =
  | "Foundations"
  | "Interfaces"
  | "Scheduling"
  | "Services"
  | "Systems"
  | "Objects"
  | "Empty states"
  | "Agents"
  | "Mechanisms"
  | "Architecture"
  | "Nature"
  | "Music"
  | "Maps"
  | "Typography"
  | "Craft"
  | "Play";

export type IllustrationStudy = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: StudyCategory;
  illustration: ReactNode;
  emptyState?: {
    title: string;
    description: string;
    illustration: ReactNode;
  };
};
