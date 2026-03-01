import type { Campaign } from "@/types/campaign";

export const starterHuCampaign: Campaign = {
  id: "starter-hu",
  learningLanguage: "hu",
  title: { en: "Starter Hungarian" },
  nodes: [{ id: "warmup", label: { en: "Warm-up" }, lessonIds: ["warmup-1", "warmup-2"] }],
  lessons: {
    "warmup-1": {
      id: "warmup-1",
      targetLanguage: "hu",
      inputMethodId: "os-layout",
      targetText: "Árvíztűrő tükörfúrógép.",
      display: {
        translation: { en: "A pangram-ish Hungarian phrase." },
      },
    },
    "warmup-2": {
      id: "warmup-2",
      targetLanguage: "hu",
      inputMethodId: "os-layout",
      targetText: "Őrült üvöltés, űr és ősz.",
      display: {
        translation: { en: "Hungarian accents practice." },
      },
    },
  },
};
