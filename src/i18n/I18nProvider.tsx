"use client";

import { createContext, useContext, useMemo } from "react";
import type { UiLanguage } from "@/types/i18n";
import type { MessageKey, Messages } from "@/i18n/messages";

type I18nContextValue = {
  locale: UiLanguage;
  messages: Messages;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: UiLanguage;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      messages,
      t: (key) => messages[key] ?? String(key),
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

