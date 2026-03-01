"use client";

import VirtualKey from "@/features/keyboard/components/VirtualKey";
import { useGameStore } from "@/store/useGameStore";
import {
  selectExpectedCodes,
  selectInputMethodId,
  selectLastKeyPulse,
  selectPressedCodes,
  selectSpacingMode,
} from "@/store/selectors";
import { defaultInputMethodId, getInputMethod } from "@/features/keyboard/inputMethods";
import { useKeyboardLayoutMap } from "@/features/keyboard/hooks/useKeyboardLayoutMap";

export default function VirtualKeyboardPanel() {
  const pressed = useGameStore(selectPressedCodes);
  const expectedCodes = useGameStore(selectExpectedCodes);
  const lastPulse = useGameStore(selectLastKeyPulse);
  const spacingMode = useGameStore(selectSpacingMode);
  const inputMethodId = useGameStore(selectInputMethodId);
  const { layoutMap } = useKeyboardLayoutMap();

  const method = getInputMethod(inputMethodId) ?? getInputMethod(defaultInputMethodId);
  const layout = method?.layout;

  if (!layout) return null;

  const showOsLabels = method?.id === "os-layout" && Boolean(layoutMap);

  const resolveLabel = (code: string, fallback: string) => {
    if (!showOsLabels || !layoutMap) return fallback;
    const val = layoutMap.get(code);
    if (!val) return fallback;
    if (code === "Space") return fallback;
    const trimmed = val.trim();
    if (!trimmed) return fallback;
    if (trimmed.length > 3) return fallback;
    return trimmed;
  };

  const rows =
    spacingMode === "continuous"
      ? layout.rows.filter((row) => !row.some((k) => k.code === "Space"))
      : layout.rows;

  return (
    <div
      className="bg-[#e6dfcf] w-fit max-w-full mx-auto p-[clamp(0.5rem,2vh,1.25rem)] rounded-[2.5rem] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-b-8 border-[#d1c8b4] relative overflow-hidden"
      style={{
        ["--vk-key" as never]: "clamp(2.5rem,3.2vw,3.25rem)",
      }}
    >
      <div className="absolute inset-x-2 sm:inset-x-3 md:inset-x-4 top-0 h-px bg-[#d1c8b4]" />
      <div className="overflow-x-hidden">
        <div className="flex flex-col gap-[clamp(0.4rem,1.2vh,0.75rem)] items-center select-none">
          {rows.map((row, rowIndex) => {
            const rowClass =
              rowIndex === 0
                ? "flex justify-center gap-1.5 sm:gap-2"
                : rowIndex === 1
                  ? "flex justify-center gap-1.5 sm:gap-2"
                  : rowIndex === 2
                    ? "flex justify-center gap-1.5 sm:gap-2"
                    : "flex justify-center gap-1.5 sm:gap-2 mt-[clamp(0.25rem,0.8vh,0.5rem)]";

            return (
              <div key={rowIndex} className={rowClass}>
                {row.map((k) => (
                  <VirtualKey
                    key={k.code}
                    code={k.code}
                    label={resolveLabel(k.code, k.label)}
                    zone={k.zone}
                    width={k.width}
                    pressed={Boolean(pressed[k.code])}
                    expected={expectedCodes.includes(k.code)}
                    pulse={lastPulse?.code === k.code ? lastPulse : undefined}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
