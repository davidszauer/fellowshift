import { clamp } from "@/lib/clamp";

export type RingEvent = { at: number; correct: boolean };

const DEFAULT_WINDOW_MS = 15_000;

export function computeLiveMetrics(eventsRing: RingEvent[], now: number, windowMs = DEFAULT_WINDOW_MS) {
  const cutoff = now - windowMs;
  const prunedRing = eventsRing.filter((e) => e.at >= cutoff && e.at <= now);
  const total = prunedRing.length;
  const correct = prunedRing.reduce((sum, e) => sum + (e.correct ? 1 : 0), 0);
  const incorrect = total - correct;

  const minutes = windowMs / 60_000;
  const grossLive = minutes > 0 ? (total / 5) / minutes : 0;
  const netChars = clamp(correct - incorrect, 0, Number.POSITIVE_INFINITY);
  const netLive = minutes > 0 ? (netChars / 5) / minutes : 0;

  const accuracyLive = total > 0 ? (correct / total) * 100 : 100;
  return { grossLive, netLive, accuracyLive, prunedRing };
}

export function computeFinalMetrics(
  correctKeystrokes: number,
  incorrectKeystrokes: number,
  startedAt: number,
  endedAt: number,
) {
  const minutes = Math.max(1e-9, (endedAt - startedAt) / 60_000);
  const total = correctKeystrokes + incorrectKeystrokes;
  const grossFinal = (total / 5) / minutes;
  const netChars = clamp(correctKeystrokes - incorrectKeystrokes, 0, Number.POSITIVE_INFINITY);
  const netFinal = (netChars / 5) / minutes;
  return { grossFinal, netFinal };
}

