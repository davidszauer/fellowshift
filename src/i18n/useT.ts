import { useI18n } from "@/i18n/I18nProvider";

export function useT() {
  return useI18n().t;
}

