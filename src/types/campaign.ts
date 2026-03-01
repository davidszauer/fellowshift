import type { DisplayText } from "@/types/typing";
import type { LearningLanguage } from "@/types/i18n";
import type { LocalizedText } from "@/types/localizedText";

export type Lesson = {
  id: string;
  targetLanguage: LearningLanguage;
  inputMethodId: string;
  targetText: string;
  display: DisplayText;
};

export type CampaignNode = {
  id: string;
  label: LocalizedText;
  lessonIds: string[];
};

export type Campaign = {
  id: string;
  learningLanguage: LearningLanguage;
  title: LocalizedText;
  nodes: CampaignNode[];
  lessons: Record<string, Lesson>;
};
