"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { KeyZone } from "@/types/keyboard";

function zoneClass(zone: KeyZone) {
  if (zone === "pinky") return "zone-pinky";
  if (zone === "ring") return "zone-ring";
  if (zone === "middle") return "zone-middle";
  if (zone === "index") return "zone-index";
  return "";
}

export default function VirtualKey({
  code,
  label,
  zone,
  width,
  pressed,
  expected,
  pulse,
}: {
  code: string;
  label: string;
  zone: KeyZone;
  width?: number;
  pressed: boolean;
  expected: boolean;
  pulse?: { at: number; correctness?: "correct" | "incorrect" };
}) {
  const reduceMotion = useReducedMotion();
  const isSpace = code === "Space";

  const sizeClass = isSpace
    ? "h-[var(--vk-key)] w-[calc(var(--vk-key)*5.4)] text-[calc(var(--vk-key)*0.32)]"
    : "h-[var(--vk-key)] w-[var(--vk-key)] text-[calc(var(--vk-key)*0.42)]";
  const base = [
    "keycap shadow-stone rounded-lg border-b-4 flex items-center justify-center font-bold relative overflow-hidden",
    sizeClass,
    zoneClass(zone),
    pressed ? "pressed" : "",
    expected ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const pulseColor =
    pulse?.correctness === "correct" ? "bg-hobbit-moss/10" : pulse?.correctness === "incorrect" ? "bg-hobbit-ember/12" : null;

  return (
    <motion.div
      layout={false}
      data-code={code}
      className={base}
      animate={reduceMotion ? undefined : pressed ? { scale: 0.98 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      {label}
      <AnimatePresence>
        {pulseColor && pulse ? (
          <motion.div
            key={pulse.at}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={`absolute inset-0 ${pulseColor}`}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
