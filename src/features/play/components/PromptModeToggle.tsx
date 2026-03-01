"use client";

import { useGameStore } from "@/store/useGameStore";
import { selectPromptMode } from "@/store/selectors";
import { motion } from "framer-motion";
import { useT } from "@/i18n/useT";

export default function PromptModeToggle() {
  const mode = useGameStore(selectPromptMode);
  const setPromptMode = useGameStore((s) => s.setPromptMode);
  const t = useT();

  return (
    <div className="wood-switch p-1.5 rounded-full flex shadow-lg border border-[#5e3a17] relative">
      <div className="absolute inset-0 rounded-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      <button
        type="button"
        onClick={() => setPromptMode("transcription")}
        aria-pressed={mode === "transcription"}
        className={[
          "relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm font-bold font-sans uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4ecd8]/70",
          mode === "transcription" ? "text-hobbit-wood-dark" : "text-[#e0d0b0] hover:text-[#f4ecd8]",
        ].join(" ")}
      >
        {mode === "transcription" && (
          <motion.span
            layoutId="prompt-mode-indicator"
            className="absolute inset-0 rounded-full bg-[#f4ecd8] shadow-md border border-[#d6c68b] overflow-hidden pointer-events-none"
            transition={{ type: "spring", bounce: 0.35, duration: 0.55 }}
          >
            <motion.span
              // Re-run the shine on each switch.
              key={mode}
              aria-hidden="true"
              className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12"
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "260%", opacity: [0, 0.65, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.span>
        )}
        <span className="relative">{t("prompt.mode.transliteration")}</span>
      </button>
      <button
        type="button"
        onClick={() => setPromptMode("translation")}
        aria-pressed={mode === "translation"}
        className={[
          "relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm font-bold font-sans uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4ecd8]/70",
          mode === "translation" ? "text-hobbit-wood-dark" : "text-[#e0d0b0] hover:text-[#f4ecd8]",
        ].join(" ")}
      >
        {mode === "translation" && (
          <motion.span
            layoutId="prompt-mode-indicator"
            className="absolute inset-0 rounded-full bg-[#f4ecd8] shadow-md border border-[#d6c68b] overflow-hidden pointer-events-none"
            transition={{ type: "spring", bounce: 0.35, duration: 0.55 }}
          >
            <motion.span
              key={mode}
              aria-hidden="true"
              className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12"
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "260%", opacity: [0, 0.65, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.span>
        )}
        <span className="relative">{t("prompt.mode.translation")}</span>
      </button>
    </div>
  );
}
