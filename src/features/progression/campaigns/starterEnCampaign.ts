import type { Campaign } from "@/types/campaign";

export const starterEnCampaign: Campaign = {
  id: "starter-en",
  learningLanguage: "en",
  title: { en: "Starter English" },
  nodes: [{ id: "warmup", label: { en: "Warm-up" }, lessonIds: ["warmup-1", "warmup-2"] }],
  lessons: {
    "warmup-1": {
      id: "warmup-1",
      targetLanguage: "en",
      inputMethodId: "os-layout",
      targetText: "Hello world.",
      display: {
        translation: { en: "Hello world." },
      },
    },
    "warmup-2": {
      id: "warmup-2",
      targetLanguage: "en",
      inputMethodId: "os-layout",
      targetText: "Cozy typing practice.",
      display: {
        translation: { en: "Cozy typing practice." },
      },
    },
  },
};
