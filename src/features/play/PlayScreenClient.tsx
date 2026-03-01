"use client";

import { useEffect } from "react";
import type { Campaign, Lesson } from "@/types/campaign";
import { useGameStore } from "@/store/useGameStore";
import { useTypingEngine } from "@/features/typing/hooks/useTypingEngine";
import AppHeader from "@/features/play/components/AppHeader";
import PromptModeToggle from "@/features/play/components/PromptModeToggle";
import StatsCards from "@/features/play/components/StatsCards";
import PromptCard from "@/features/play/components/PromptCard";
import VirtualKeyboardPanel from "@/features/keyboard/components/VirtualKeyboardPanel";
import KeyboardVisibilityToggle from "@/features/play/components/KeyboardVisibilityToggle";
import { selectIsPro, selectKeyboardHidden } from "@/store/selectors";
import { useT } from "@/i18n/useT";

export default function PlayScreenClient({ campaign, lesson }: { campaign: Campaign; lesson: Lesson }) {
  const loadLesson = useGameStore((s) => s.loadLesson);
  const start = useGameStore((s) => s.start);
  const restart = useGameStore((s) => s.restart);
  const status = useGameStore((s) => s.status);
  const isPro = useGameStore(selectIsPro);
  const keyboardHidden = useGameStore(selectKeyboardHidden);
  const t = useT();

  useEffect(() => {
    loadLesson({ campaign, lesson });
      start();
    }, [campaign, lesson, loadLesson, start]);

    useTypingEngine(status === "running" || status === "paused", lesson.inputMethodId);

    return (
      <>
      <AppHeader subtitle={campaign.title} />
      <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-hobbit-gold via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-[clamp(0.75rem,2vh,2rem)] flex flex-col items-center justify-start flex-1 min-h-0 relative z-10 max-w-5xl gap-[clamp(0.75rem,2vh,2rem)]">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-[clamp(0.75rem,2vh,1.5rem)]">
            <PromptModeToggle />
            <StatsCards />
          </div>

          <div
            className="w-full flex-1 min-h-0 flex flex-col justify-center"
            style={{
              ["--prompt-boost" as never]: isPro && keyboardHidden ? "1.22" : "1",
            }}
          >
            <PromptCard />
            {status === "completed" ? (
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="px-5 py-2 rounded-full bg-gradient-to-b from-[#f9dba8] to-[#eebb44] border border-[#d4a017] shadow-[0_4px_10px_rgba(238,187,68,0.4)]">
                  <span className="text-[#7a5805] font-bold text-sm tracking-wide font-display">
                    {t("lesson.complete")}
                  </span>
                </div>
                <button
                  onClick={restart}
                  className="px-5 py-2 rounded-full bg-hobbit-wood text-[#f4ecd8] hover:bg-hobbit-wood-dark transition-colors shadow-stone border-b-4 border-hobbit-wood-dark font-sans uppercase tracking-wide text-sm font-bold"
                >
                  {t("lesson.restart")}
                </button>
              </div>
            ) : null}
          </div>

          {!isPro || !keyboardHidden ? (
            <div className="w-full pb-[clamp(0.5rem,1.5vh,1.5rem)]">
              <VirtualKeyboardPanel />
            </div>
          ) : null}
        </div>

        <div className="fixed right-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30">
          <KeyboardVisibilityToggle />
        </div>
      </main>
    </>
  );
}
