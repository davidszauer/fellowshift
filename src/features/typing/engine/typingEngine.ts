import type { InputEvent } from "@/types/keyboard";
import type { SpacingMode, TypingResult } from "@/types/typing";

export type EngineState = {
  target: string;
  typed: string;
  activeIndex: number;
};

function isCaseEquivalent(expected: string, actual: string) {
  if (!expected || !actual) return false;
  if (expected === actual) return true;
  if (expected.length !== 1 || actual.length !== 1) return false;

  const expectedLower = expected.toLowerCase();
  const actualLower = actual.toLowerCase();
  if (expectedLower !== actualLower) return false;

  const expectedUpper = expected.toUpperCase();
  const actualUpper = actual.toUpperCase();
  return expectedUpper === actualUpper;
}

export type ReduceTypingOptions = {
  spacingMode?: SpacingMode;
};

function advanceOverSpacesForward(target: string, typed: string, activeIndex: number) {
  let nextIndex = activeIndex;
  while (target[nextIndex] === " ") nextIndex += 1;
  if (nextIndex === activeIndex) return { typed, activeIndex };
  return { typed: typed + " ".repeat(nextIndex - activeIndex), activeIndex: nextIndex };
}

export function reduceTyping(state: EngineState, input: InputEvent, options?: ReduceTypingOptions) {
  const spacingMode = options?.spacingMode ?? "strict";

  if (input.kind === "backspace") {
    if (state.activeIndex <= 0) {
      const result: TypingResult = { kind: "noop", at: input.at, code: input.code };
      return { next: state, result, pulse: { code: input.code, at: input.at } };
    }

    let activeIndex = state.activeIndex - 1;
    let typed = state.typed.slice(0, -1);

    if (spacingMode === "continuous") {
      while (activeIndex > 0 && state.target[activeIndex - 1] === " " && typed.endsWith(" ")) {
        activeIndex -= 1;
        typed = typed.slice(0, -1);
      }
    }

    const next: EngineState = { ...state, activeIndex, typed };
    const result: TypingResult = { kind: "backspace", at: input.at, code: input.code };
    return { next, result, pulse: { code: input.code, at: input.at } };
  }

  if (input.kind !== "char") {
    const result: TypingResult = { kind: "noop", at: input.at, code: input.code };
    return { next: state, result, pulse: undefined };
  }

  if (spacingMode === "continuous" && input.char !== " ") {
    const advanced = advanceOverSpacesForward(state.target, state.typed, state.activeIndex);
    state = { ...state, ...advanced };
  }

  const effectiveExpectedChar = state.target[state.activeIndex] ?? "";

  if (!effectiveExpectedChar) {
    const result: TypingResult = {
      kind: "noop",
      at: input.at,
      code: input.code,
      actualChar: input.char,
    };
    return { next: state, result, pulse: { code: input.code, at: input.at } };
  }

  if (input.char === effectiveExpectedChar || isCaseEquivalent(effectiveExpectedChar, input.char)) {
    const typedChar = effectiveExpectedChar;

    let next: EngineState = {
      ...state,
      activeIndex: state.activeIndex + 1,
      typed: state.typed + typedChar,
    };

    if (spacingMode === "continuous") {
      const advanced = advanceOverSpacesForward(next.target, next.typed, next.activeIndex);
      next = { ...next, ...advanced };
    }

    const result: TypingResult = {
      kind: "correct",
      at: input.at,
      code: input.code,
      expectedChar: effectiveExpectedChar,
      actualChar: input.char,
    };
    return { next, result, pulse: { code: input.code, at: input.at, correctness: "correct" as const } };
  }

  const result: TypingResult = {
    kind: "incorrect",
    at: input.at,
    code: input.code,
    expectedChar: effectiveExpectedChar,
    actualChar: input.char,
  };
  return { next: state, result, pulse: { code: input.code, at: input.at, correctness: "incorrect" as const } };
}
