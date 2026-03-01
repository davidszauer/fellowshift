import type { UiLanguage } from "@/types/i18n";

export const uiLanguages = ["en", "ru", "hu"] as const satisfies readonly UiLanguage[];

export function isUiLanguage(value: string): value is UiLanguage {
  return (uiLanguages as readonly string[]).includes(value);
}

export const defaultUiLanguage: UiLanguage = "en";

