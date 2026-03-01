"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

type Option<T extends string> = {
  value: T;
  label: string;
};

export default function LotrSegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  layoutId,
  className,
  variant = "parchment",
}: {
  value: T;
  options: readonly [Option<T>, Option<T>];
  onChange: (next: T) => void;
  layoutId: string;
  className?: string;
  variant?: "parchment" | "wood";
}) {
  const isWood = variant === "wood";

  return (
    <div
      className={clsx(
        isWood
          ? "wood-switch p-1.5 rounded-full flex shadow-lg border border-[#5e3a17] relative"
          : "lotr-toggle p-1.5 rounded-full flex relative",
        className,
      )}
    >
      {isWood ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"
        />
      ) : null}
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={clsx(
              "relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm font-bold font-sans uppercase tracking-wide transition-colors",
              isWood
                ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4ecd8]/70"
                : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hobbit-gold/50",
              isWood
                ? active
                  ? "text-hobbit-wood-dark"
                  : "text-[#e0d0b0] hover:text-[#f4ecd8]"
                : active
                  ? "text-hobbit-wood-dark"
                  : "text-hobbit-wood/65 hover:text-hobbit-wood-dark",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className={clsx("absolute inset-0 rounded-full pointer-events-none", isWood && "overflow-hidden")}
                transition={{ type: "spring", bounce: isWood ? 0.35 : 0.25, duration: 0.55 }}
              >
                {isWood ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[#f4ecd8] shadow-md border border-[#d6c68b]"
                    />
                    <motion.span
                      // Re-run the shine on each switch.
                      key={value}
                      aria-hidden="true"
                      className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12"
                      initial={{ x: "-60%", opacity: 0 }}
                      animate={{ x: "260%", opacity: [0, 0.65, 0] }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </>
                ) : (
                  <span aria-hidden="true" className="lotr-ring-thumb" />
                )}
              </motion.span>
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
