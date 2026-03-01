"use client";

import { useGameStore } from "@/store/useGameStore";
import { selectIsPro, selectKeyboardHidden } from "@/store/selectors";

export default function KeyboardVisibilityToggle() {
  const isPro = useGameStore(selectIsPro);
  const hidden = useGameStore(selectKeyboardHidden);
  const toggle = useGameStore((s) => s.toggleKeyboardHidden);

  if (!isPro) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={hidden ? "Show keyboard" : "Hide keyboard"}
      className="text-xs font-sans font-semibold tracking-wide text-hobbit-wood/70 hover:text-hobbit-wood-dark underline underline-offset-4 decoration-[#d6c68b] decoration-2 transition-colors opacity-60 hover:opacity-100"
    >
      {hidden ? "Show keyboard" : "Hide keyboard"}
    </button>
  );
}
