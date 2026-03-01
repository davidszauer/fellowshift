"use client";

import { useGameStore } from "@/store/useGameStore";
import { selectAccuracy, selectWpmGross, selectWpmNet } from "@/store/selectors";

function formatInt(value: number) {
  return Math.round(Number.isFinite(value) ? value : 0).toString();
}

function formatPct(value: number) {
  const v = Math.max(0, Math.min(100, value));
  return `${Math.round(v)}%`;
}

export default function StatsCards() {
  const gross = useGameStore(selectWpmGross);
  const net = useGameStore(selectWpmNet);
  const accuracy = useGameStore(selectAccuracy);

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="flex flex-col items-center bg-hobbit-paper px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl shadow-md border border-[#d6c68b] rotate-1 transform hover:rotate-0 transition-transform duration-300">
        <span className="text-[10px] text-hobbit-wood/70 uppercase font-bold tracking-wider font-sans">WPM</span>
        <span className="text-xl font-bold text-hobbit-wood-dark font-display">
          {formatInt(gross)} <span className="text-[11px] font-sans text-hobbit-wood/60">G</span>{" "}
          <span className="text-hobbit-wood/30">/</span> {formatInt(net)}{" "}
          <span className="text-[11px] font-sans text-hobbit-wood/60">N</span>
        </span>
      </div>
      <div className="flex flex-col items-center bg-hobbit-paper px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl shadow-md border border-[#d6c68b] -rotate-1 transform hover:rotate-0 transition-transform duration-300">
        <span className="text-[10px] text-hobbit-wood/70 uppercase font-bold tracking-wider font-sans">
          Accuracy
        </span>
        <span className="text-xl font-bold text-hobbit-moss font-display">{formatPct(accuracy)}</span>
      </div>
    </div>
  );
}
