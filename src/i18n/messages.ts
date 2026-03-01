import type { UiLanguage } from "@/types/i18n";

export const messages = {
  en: {
    "app.title": "FellowShift",
    "home.tagline": "Blind typing language learning with cozy vibes.",
    "home.startRu": "Start typing with your OS keyboard layout (switch layouts for RU/HU as needed).",
    "home.beginJourney": "Begin Journey",
    "home.pickCampaign": "Choose a campaign",

    "settings.title": "Settings",
    "settings.section.typing": "Typing",
    "settings.spacingMode.help":
      "Choose whether spaces must be typed, or auto-inserted so you can keep typing letters.",
    "settings.spacingMode.strict": "Strict",
    "settings.spacingMode.continuous": "Continuous",
    "settings.spacingMode.strictHelp": "Type every character exactly, including spaces.",
    "settings.spacingMode.continuousHelp": "Spaces in the prompt are auto-inserted; keep typing letters across words.",

    "settings.section.language": "Language",
    "settings.uiLanguage": "UI language",
    "settings.hintLanguage": "Translation hint language",
    "settings.hintLanguage.auto": "Auto (match UI)",
    "language.en": "English",
    "language.ru": "Russian",
    "language.hu": "Hungarian",

    "prompt.mode.transliteration": "Transliteration",
    "prompt.mode.translation": "Translation",
    "prompt.typeHighlighted": "Type the highlighted character",

    "lesson.complete": "Lesson complete",
    "lesson.restart": "Restart",

    "notFound.title": "Not found",
    "notFound.body": "That page doesn’t exist.",
  },
  ru: {
    "app.title": "FellowShift",
    "home.tagline": "Уютное обучение языкам через слепую печать.",
    "home.startRu": "Начните печатать с раскладкой вашей ОС (при необходимости переключайтесь на RU/HU).",
    "home.beginJourney": "Начать путь",
    "home.pickCampaign": "Выберите кампанию",

    "settings.title": "Настройки",
    "settings.section.typing": "Печать",
    "settings.spacingMode.help":
      "Выберите: нужно ли печатать пробелы, или они будут подставляться автоматически.",
    "settings.spacingMode.strict": "Строго",
    "settings.spacingMode.continuous": "Непрерывно",
    "settings.spacingMode.strictHelp": "Печатайте каждый символ точно, включая пробелы.",
    "settings.spacingMode.continuousHelp": "Пробелы подставляются автоматически; печатайте буквы без остановки.",

    "settings.section.language": "Язык",
    "settings.uiLanguage": "Язык интерфейса",
    "settings.hintLanguage": "Язык перевода-подсказки",
    "settings.hintLanguage.auto": "Авто (как UI)",
    "language.en": "English",
    "language.ru": "Русский",
    "language.hu": "Magyar",

    "prompt.mode.transliteration": "Транслитерация",
    "prompt.mode.translation": "Перевод",
    "prompt.typeHighlighted": "Печатайте подсвеченный символ",

    "lesson.complete": "Урок завершён",
    "lesson.restart": "Повторить",

    "notFound.title": "Не найдено",
    "notFound.body": "Такой страницы не существует.",
  },
  hu: {
    "app.title": "FellowShift",
    "home.tagline": "Hangulatos nyelvtanulás vakon gépeléssel.",
    "home.startRu": "Gépelj az operációs rendszer billentyűzetkiosztásával (RU/HU-hoz válts kiosztást).",
    "home.beginJourney": "Kezdés",
    "home.pickCampaign": "Válassz kampányt",

    "settings.title": "Beállítások",
    "settings.section.typing": "Gépelés",
    "settings.spacingMode.help":
      "Válaszd ki: a szóközöket is gépelni kell-e, vagy automatikusan bekerülnek, hogy folyamatosan gépelhess.",
    "settings.spacingMode.strict": "Szigorú",
    "settings.spacingMode.continuous": "Folyamatos",
    "settings.spacingMode.strictHelp": "Minden karaktert pontosan gépelj, a szóközöket is.",
    "settings.spacingMode.continuousHelp": "A szóközök automatikusan bekerülnek; gépelj tovább a szavak között is.",

    "settings.section.language": "Nyelv",
    "settings.uiLanguage": "UI nyelv",
    "settings.hintLanguage": "Fordítás nyelve",
    "settings.hintLanguage.auto": "Automatikus (UI)",
    "language.en": "English",
    "language.ru": "Orosz",
    "language.hu": "Magyar",

    "prompt.mode.transliteration": "Átírás",
    "prompt.mode.translation": "Fordítás",
    "prompt.typeHighlighted": "Gépeld be a kiemelt karaktert",

    "lesson.complete": "Lecke kész",
    "lesson.restart": "Újraindítás",

    "notFound.title": "Nem található",
    "notFound.body": "Ez az oldal nem létezik.",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];
export type Messages = Record<MessageKey, string>;

export function getMessages(locale: UiLanguage): Messages {
  return messages[locale] as unknown as Messages;
}
