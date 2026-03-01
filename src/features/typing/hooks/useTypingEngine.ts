import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { defaultInputMethodId, getInputMethod } from "@/features/keyboard/inputMethods";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useTypingEngine(enabled: boolean, inputMethodId?: string) {
  const keyDown = useGameStore((s) => s.keyDown);
  const keyUp = useGameStore((s) => s.keyUp);
  const applyInput = useGameStore((s) => s.applyInput);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    if (!enabled) return;

    const method = getInputMethod(inputMethodId ?? defaultInputMethodId);
    if (!method) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if ((event as any).isComposing || event.key === "Process") return;
      if (isEditableTarget(event.target)) return;

      if (event.key === "Escape") {
        if (status === "running") pause();
        if (status === "paused") resume();
        return;
      }

      if (status !== "running") return;

      const at = Date.now();
      keyDown(event.code, at);

      const isBackspace = event.code === "Backspace";
      const isSpace = event.code === "Space";
      if (isBackspace || isSpace) event.preventDefault();

      if (event.repeat && event.code !== "Backspace") return;

      const input = method.mapKeyDown(event, at);
      if (input.kind === "noop") return;
      applyInput(input);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const at = Date.now();
      keyUp(event.code, at);
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled, inputMethodId, keyDown, keyUp, applyInput, pause, resume, status]);
}
