import { describe, expect, it } from "vitest";
import { reduceTyping } from "@/features/typing/engine/typingEngine";

describe("reduceTyping", () => {
  it("advances on correct char", () => {
    const s0 = { target: "аб", typed: "", activeIndex: 0 };
    const { next, result } = reduceTyping(s0, { kind: "char", char: "а", code: "KeyF", at: 1 });
    expect(next.activeIndex).toBe(1);
    expect(next.typed).toBe("а");
    expect(result.kind).toBe("correct");
  });

  it("treats case-only mismatch as correct", () => {
    const s0 = { target: "В", typed: "", activeIndex: 0 };
    const { next, result } = reduceTyping(s0, { kind: "char", char: "в", code: "KeyD", at: 1 });
    expect(next.activeIndex).toBe(1);
    expect(next.typed).toBe("В");
    expect(result.kind).toBe("correct");
  });

  it("does not advance on incorrect char", () => {
    const s0 = { target: "аб", typed: "", activeIndex: 0 };
    const { next, result } = reduceTyping(s0, { kind: "char", char: "б", code: "Comma", at: 1 });
    expect(next.activeIndex).toBe(0);
    expect(next.typed).toBe("");
    expect(result.kind).toBe("incorrect");
  });

  it("backspace rewinds and clears typed", () => {
    const s0 = { target: "аб", typed: "а", activeIndex: 1 };
    const { next, result } = reduceTyping(s0, { kind: "backspace", code: "Backspace", at: 2 });
    expect(next.activeIndex).toBe(0);
    expect(next.typed).toBe("");
    expect(result.kind).toBe("backspace");
  });

  it("continuous mode auto-advances over spaces after correct chars", () => {
    const s0 = { target: "а б", typed: "", activeIndex: 0 };
    const { next, result } = reduceTyping(
      s0,
      { kind: "char", char: "а", code: "KeyF", at: 1 },
      { spacingMode: "continuous" },
    );
    expect(result.kind).toBe("correct");
    expect(next.activeIndex).toBe(2);
    expect(next.typed).toBe("а ");
  });

  it("continuous mode lets you type the next word without typing space", () => {
    const s0 = { target: "а б", typed: "а", activeIndex: 1 };
    const { next, result } = reduceTyping(
      s0,
      { kind: "char", char: "б", code: "Comma", at: 2 },
      { spacingMode: "continuous" },
    );
    expect(result.kind).toBe("correct");
    expect(next.activeIndex).toBe(3);
    expect(next.typed).toBe("а б");
  });

  it("continuous mode backspace skips over spaces", () => {
    const s0 = { target: "а б", typed: "а б", activeIndex: 3 };
    const { next, result } = reduceTyping(
      s0,
      { kind: "backspace", code: "Backspace", at: 3 },
      { spacingMode: "continuous" },
    );
    expect(result.kind).toBe("backspace");
    expect(next.activeIndex).toBe(1);
    expect(next.typed).toBe("а");
  });
});
