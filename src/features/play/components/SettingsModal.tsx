"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { selectHintLanguage, selectSpacingMode } from "@/store/selectors";
import LotrSegmentedToggle from "@/features/play/components/LotrSegmentedToggle";
import { useT } from "@/i18n/useT";
import { useI18n } from "@/i18n/I18nProvider";
import { usePathname, useRouter } from "next/navigation";
import { isUiLanguage } from "@/i18n/locales";

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const spacingMode = useGameStore(selectSpacingMode);
  const setSpacingMode = useGameStore((s) => s.setSpacingMode);
  const hintLanguage = useGameStore(selectHintLanguage);
  const setHintLanguage = useGameStore((s) => s.setHintLanguage);
  const t = useT();
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-24 w-[min(92vw,640px)] rounded-[2rem] bg-hobbit-paper border border-[#eae0d0] shadow-parchment overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between px-7 py-6 border-b border-[#eae0d0]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-hobbit-wood-dark text-2xl">settings</span>
            <h3 className="text-hobbit-wood-dark text-xl font-bold font-display">{t("settings.title")}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex size-10 items-center justify-center rounded-full bg-[#d6c68b] text-hobbit-wood-dark hover:bg-[#c9b87a] transition-colors shadow-stone active:translate-y-0.5 active:shadow-none border-b-4 border-[#b5a56a]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          </div>

        <div className="relative z-10 px-7 py-7 flex flex-col gap-8">
          <div>
            <p className="text-hobbit-wood-dark font-bold font-display text-lg">{t("settings.section.typing")}</p>
            <p className="text-hobbit-wood/70 text-sm mt-1 font-sans">
              {t("settings.spacingMode.help")}
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 flex-wrap">
            <LotrSegmentedToggle
              value={spacingMode}
              layoutId="spacing-mode-indicator"
              variant="wood"
              options={[
                { value: "strict", label: t("settings.spacingMode.strict") },
                { value: "continuous", label: t("settings.spacingMode.continuous") },
              ]}
              onChange={setSpacingMode}
            />

            <div className="text-sm text-hobbit-wood/75 font-sans max-w-sm">
              {spacingMode === "continuous" ? (
                <p>
                  <span className="font-bold text-hobbit-wood-dark">{t("settings.spacingMode.continuous")}:</span>{" "}
                  {t("settings.spacingMode.continuousHelp")}
                </p>
              ) : (
                <p>
                  <span className="font-bold text-hobbit-wood-dark">{t("settings.spacingMode.strict")}:</span>{" "}
                  {t("settings.spacingMode.strictHelp")}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[#eae0d0] pt-7">
            <p className="text-hobbit-wood-dark font-bold font-display text-lg">{t("settings.section.language")}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-hobbit-wood/80 font-sans">
                <span className="font-bold text-hobbit-wood-dark">{t("settings.uiLanguage")}</span>
                <select
                  value={locale}
                  onChange={(e) => {
                    const next = e.target.value;
                    document.cookie = `fs_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
                    const parts = pathname.split("/");
                    if (parts.length >= 2) parts[1] = next;
                    const nextPath = parts.join("/") || `/${next}`;
                    router.push(nextPath);
                  }}
                  className="rounded-xl border border-[#d6c68b] bg-white/60 px-3 py-2 text-hobbit-wood-dark shadow-sm"
                >
                  <option value="en">{t("language.en")}</option>
                  <option value="ru">{t("language.ru")}</option>
                  <option value="hu">{t("language.hu")}</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-hobbit-wood/80 font-sans">
                <span className="font-bold text-hobbit-wood-dark">{t("settings.hintLanguage")}</span>
                <select
                  value={hintLanguage}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (next === "auto" || isUiLanguage(next)) setHintLanguage(next);
                  }}
                  className="rounded-xl border border-[#d6c68b] bg-white/60 px-3 py-2 text-hobbit-wood-dark shadow-sm"
                >
                  <option value="auto">{t("settings.hintLanguage.auto")}</option>
                  <option value="en">{t("language.en")}</option>
                  <option value="ru">{t("language.ru")}</option>
                  <option value="hu">{t("language.hu")}</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
