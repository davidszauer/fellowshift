"use client";

import { useEffect } from "react";
import type { UiLanguage } from "@/types/i18n";

export default function HtmlLangSync({ locale }: { locale: UiLanguage }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

