"use client";

import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useFitText } from "@/lib/useFitText";
import type { SessionState } from "@/types/typing";

function renderSegment(text: string, className: string) {
  return text.split("").map((ch, i) => {
    if (ch === " ") {
      return (
        <span key={`${className}-space-${i}`} className={className}>
          {" "}
        </span>
      );
    }
    return (
      <span key={`${className}-${i}`} className={className}>
        {ch}
      </span>
    );
  });
}

export default function TypingPromptLine({
  target,
  activeIndex,
  error,
}: {
  target: string;
  activeIndex: number;
  error: SessionState["error"];
}) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const fitRef = useFitText<HTMLDivElement>({ deps: [target, activeIndex], minFontSizePx: 22 });

  useEffect(() => {
    if (reduceMotion) {
      controls.set({ x: 0 });
      return;
    }

    if (!error.at) return;

    void controls.start({
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.28 },
    });
  }, [controls, reduceMotion, error.at]);

  const prefix = target.slice(0, activeIndex);
  const activeChar = target[activeIndex] ?? "";
  const suffix = activeChar ? target.slice(activeIndex + 1) : "";
  const isErrorActive = Boolean(error.at) && error.index === activeIndex && Boolean(activeChar);

  return (
    <motion.div
      ref={fitRef}
      animate={controls}
      className="w-full max-h-full overflow-hidden text-center text-[calc(clamp(2.75rem,5vw,6rem)*var(--prompt-boost,1))] font-bold leading-tight tracking-wide break-words [overflow-wrap:anywhere] font-display text-hobbit-ink"
      aria-label="Typing prompt"
    >
      {renderSegment(prefix, "text-hobbit-shire drop-shadow-sm")}

      {activeChar ? (
        <span className="inline-block w-[clamp(3px,0.14em,6px)] h-[0.95em] bg-hobbit-wood-dark animate-caret-blink motion-reduce:animate-none align-[-0.08em] mx-[0.12em] rounded-full" />
      ) : null}

      {activeChar ? (
        <span
          className={[
            "text-hobbit-wood-dark underline decoration-2 underline-offset-[0.22em]",
            isErrorActive ? "text-hobbit-ember decoration-hobbit-ember/60" : "decoration-hobbit-wood/30",
          ].join(" ")}
        >
          {activeChar === " " ? " " : activeChar}
        </span>
      ) : null}

      {suffix ? renderSegment(suffix, "text-hobbit-wood/40") : null}
    </motion.div>
  );
}
