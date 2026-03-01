"use client";

import { useGameStore } from "@/store/useGameStore";
import { useFitText } from "@/lib/useFitText";
import {
  selectActiveIndex,
  selectCombo,
  selectDisplay,
  selectErrorPulse,
  selectHintLanguage,
  selectPromptMode,
  selectTarget,
  selectTransliteration,
} from "@/store/selectors";
import ComboBadge from "@/features/typing/components/ComboBadge";
import TypingPromptLine from "@/features/typing/components/TypingPromptLine";
import { useT } from "@/i18n/useT";
import { useI18n } from "@/i18n/I18nProvider";
import { resolveLocalizedText } from "@/i18n/resolveLocalizedText";

export default function PromptCard() {
  const target = useGameStore(selectTarget);
  const activeIndex = useGameStore(selectActiveIndex);
  const combo = useGameStore(selectCombo);
  const mode = useGameStore(selectPromptMode);
  const display = useGameStore(selectDisplay);
  const transliteration = useGameStore(selectTransliteration);
  const hintLanguageSetting = useGameStore(selectHintLanguage);
  const error = useGameStore(selectErrorPulse);
  const t = useT();
  const { locale } = useI18n();

  const hintLanguageEffective = hintLanguageSetting === "auto" ? locale : hintLanguageSetting;
  const translation = resolveLocalizedText(display.translation, hintLanguageEffective, "en");

  const helperText = mode === "translation" ? translation : transliteration;
  const helperFitRef = useFitText<HTMLParagraphElement>({
    deps: [helperText, combo, mode],
    minFontSizePx: 12,
  });

  return (
    <div className="relative w-full flex-1 min-h-0 justify-center bg-hobbit-paper rounded-[3rem] shadow-parchment p-[clamp(1.25rem,3vw,3rem)] flex flex-col gap-[clamp(0.75rem,2vh,1.5rem)] items-center text-center overflow-hidden border border-[#eae0d0]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none" />
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[#d6c68b]/40">
        <span className="material-symbols-outlined text-[clamp(2.25rem,5vh,3.5rem)]">eco</span>
      </div>
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-[#d6c68b]/40 rotate-180">
        <span className="material-symbols-outlined text-[clamp(2.25rem,5vh,3.5rem)]">eco</span>
      </div>

      <div className="relative z-10 w-full flex-1 min-h-0 grid grid-rows-[auto_1fr_auto] gap-[clamp(0.5rem,1.5vh,1rem)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <div aria-hidden="true" />
          <p
            ref={helperFitRef}
            className="min-w-0 h-[clamp(2.25rem,6vh,3.25rem)] overflow-hidden text-hobbit-wood/80 text-[calc(clamp(1.25rem,2vw,1.75rem)*var(--prompt-boost,1))] font-serif italic break-words [overflow-wrap:anywhere]"
          >
            {helperText}
          </p>
          <div className="justify-self-end">
            <ComboBadge combo={combo} />
          </div>
        </div>

        <div className="min-h-0 flex items-center justify-center">
          <TypingPromptLine target={target} activeIndex={activeIndex} error={error} />
        </div>

        <p className="text-[clamp(0.75rem,1.6vh,0.875rem)] text-hobbit-wood/60 font-sans italic tracking-wide">
          {t("prompt.typeHighlighted")}
        </p>
      </div>
    </div>
  );
}
