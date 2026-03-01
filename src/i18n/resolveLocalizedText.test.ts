import { describe, expect, it } from "vitest";
import { resolveLocalizedText } from "@/i18n/resolveLocalizedText";

describe("resolveLocalizedText", () => {
  it("prefers direct locale, then fallback locale, then first available", () => {
    expect(resolveLocalizedText({ hu: "Szia", en: "Hi" }, "hu", "en")).toBe("Szia");
    expect(resolveLocalizedText({ en: "Hi" }, "ru", "en")).toBe("Hi");
    expect(resolveLocalizedText({ ru: "Привет" }, "hu", "en")).toBe("Привет");
  });

  it("returns empty string when missing", () => {
    expect(resolveLocalizedText(undefined, "en")).toBe("");
    expect(resolveLocalizedText({}, "en")).toBe("");
  });
});

