"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { selectCurrentNodeIndex, selectNodes, selectPlayerLevel } from "@/store/selectors";
import JourneyProgress from "@/features/play/components/JourneyProgress";
import SettingsModal from "@/features/play/components/SettingsModal";
import type { LocalizedText } from "@/types/localizedText";
import { useI18n } from "@/i18n/I18nProvider";
import { resolveLocalizedText } from "@/i18n/resolveLocalizedText";

export default function AppHeader({ subtitle }: { subtitle: LocalizedText }) {
  const nodes = useGameStore(selectNodes);
  const currentNodeIndex = useGameStore(selectCurrentNodeIndex);
  const level = useGameStore(selectPlayerLevel);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { locale } = useI18n();

  const labels = useMemo(() => nodes.slice(0, 3).map((n) => resolveLocalizedText(n.label, locale)), [nodes, locale]);
  const subtitleText = useMemo(() => resolveLocalizedText(subtitle, locale), [subtitle, locale]);

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 bg-[#eaddcf] border-b border-[#d6c68b] shadow-sm relative z-20">
        <div className="flex items-center gap-4">
          <div className="size-10 text-hobbit-wood-dark flex items-center justify-center bg-white/50 rounded-full shadow-inner">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
          </div>
          <div>
            <h2 className="text-hobbit-wood-dark text-2xl font-bold font-display tracking-tight">FellowShift</h2>
            <p className="text-xs text-hobbit-wood/80 font-semibold tracking-widest uppercase font-sans">
              {subtitleText}
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-2 w-1/3 max-w-lg mx-8">
          <JourneyProgress labels={labels} activeIndex={currentNodeIndex} />
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-[#d6c68b] rounded-full shadow-sm">
            <span className="text-hobbit-moss material-symbols-outlined text-xl">spa</span>
            <span className="text-hobbit-wood-dark text-lg font-bold font-display">{level}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Profile"
              className="flex size-10 items-center justify-center rounded-full bg-hobbit-wood text-[#f4ecd8] hover:bg-hobbit-wood-dark transition-colors shadow-stone active:translate-y-0.5 active:shadow-none border-b-4 border-hobbit-wood-dark"
            >
              <span className="material-symbols-outlined">person</span>
            </button>
            <button
              type="button"
              aria-label="Settings"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen(true)}
              className="flex size-10 items-center justify-center rounded-full bg-[#d6c68b] text-hobbit-wood-dark hover:bg-[#c9b87a] transition-colors shadow-stone active:translate-y-0.5 active:shadow-none border-b-4 border-[#b5a56a]"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
