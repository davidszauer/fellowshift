import type { UiLanguage } from "@/types/i18n";
import type { LocalizedText } from "@/types/localizedText";

export function resolveLocalizedText(
  text: LocalizedText | undefined,
  locale: UiLanguage,
  fallbackLocale: UiLanguage = "en",
) {
  if (!text) return "";
  const direct = text[locale];
  if (direct) return direct;
  const fallback = text[fallbackLocale];
  if (fallback) return fallback;
  for (const value of Object.values(text)) {
    if (value) return value;
  }
  return "";
}

