import type { Campaign } from "@/types/campaign";

const baseLotrRuCampaign: Campaign = {
  id: "lotr-ru",
  learningLanguage: "ru",
  title: { en: "Cozy Hobbiton Mode" },
  nodes: [
    { id: "bag-end", label: { en: "Bag End" }, lessonIds: ["bag-end-1"] },
    {
      id: "green-dragon",
      label: { en: "The Green Dragon" },
      lessonIds: ["green-dragon-1"],
    },
    { id: "bree", label: { en: "Bree" }, lessonIds: ["bree-1"] },
  ],
  lessons: {
    "bag-end-1": {
      id: "bag-end-1",
      targetLanguage: "ru",
      inputMethodId: "os-layout",
      targetText: "В норе под землей жил хоббит.",
      display: {
        translation: { en: "In a hole in the ground there lived a hobbit." },
        transliterationLatin: "V nore pod zemlyoy zhil khobbit",
      },
    },
    "green-dragon-1": {
      id: "green-dragon-1",
      targetLanguage: "ru",
      inputMethodId: "os-layout",
      targetText: "Я не знаю половины из вас",
      display: {
        translation: { en: "I don't know half of you" },
        transliterationLatin: "Ya ne znayu poloviny iz vas",
      },
    },
    "bree-1": {
      id: "bree-1",
      targetLanguage: "ru",
      inputMethodId: "os-layout",
      targetText: "Не все, кто странствует, потеряны",
      display: {
        translation: { en: "Not all those who wander are lost" },
        transliterationLatin: "Ne vse, kto stranstvuet, poteryany",
      },
    },
  },
};

function ensureFirstLessonExists(campaign: Campaign): Campaign {
  const firstLessonId = campaign.nodes[0]?.lessonIds[0];
  if (!firstLessonId) return campaign;
  if (campaign.lessons[firstLessonId]) return campaign;

  return {
    ...campaign,
    lessons: {
      ...campaign.lessons,
      [firstLessonId]: {
        id: firstLessonId,
        targetLanguage: "ru",
        inputMethodId: "os-layout",
        targetText: "В норе под землей жил хоббит.",
        display: {
          translation: { en: "In a hole in the ground there lived a hobbit." },
          transliterationLatin: "V nore pod zemlyoy zhil khobbit",
        },
      },
    },
  };
}

export const lotrRuCampaign: Campaign = ensureFirstLessonExists(baseLotrRuCampaign);
