import type { LocalizedText } from "@/types/localizedText";

export type SessionStatus = "idle" | "running" | "paused" | "completed";

export type PromptMode = "translation" | "transcription";

export type SpacingMode = "strict" | "continuous";

export type DisplayText = {
  translation?: LocalizedText;
  transliterationLatin?: string;
};

export type SessionState = {
  status: SessionStatus;
  campaignId: string;
  lessonId: string;
  inputMethodId: string;
  promptMode: PromptMode;
  target: string;
  display: DisplayText;
  typed: string;
  activeIndex: number;
  error: { at?: number; index?: number };
};

export type TypingResult = {
  kind: "correct" | "incorrect" | "backspace" | "noop";
  at: number;
  code?: string;
  expectedChar?: string;
  actualChar?: string;
};
