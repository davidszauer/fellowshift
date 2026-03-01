import { describe, expect, it } from "vitest";
import { normalizeTargetText } from "@/features/typing/engine/normalize";

describe("normalizeTargetText", () => {
  it("converts NBSP to space and normalizes NFC", () => {
    const input = "В\u00a0начале";
    expect(normalizeTargetText(input)).toBe("В начале");
  });
});

