"use client";

import { motion } from "framer-motion";

export default function ComboBadge({ combo }: { combo: number }) {
  if (combo <= 0) return null;

  return (
    <motion.div
      key={combo}
      initial={{ scale: 0.95, opacity: 0.0 }}
      animate={{ scale: [0.95, 1.05, 1.0], opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex max-w-[clamp(7.5rem,26vw,13rem)] items-center gap-2 bg-gradient-to-b from-[#f9dba8] to-[#eebb44] border border-[#d4a017] px-4 py-1.5 rounded-full shadow-[0_4px_10px_rgba(238,187,68,0.4)]"
    >
      <div className="size-2 rounded-full bg-white animate-ping" />
      <span className="text-[#7a5805] font-bold text-[0.8rem] tracking-wide font-display truncate">
        Precious Combo x{combo}
      </span>
    </motion.div>
  );
}
