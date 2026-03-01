import { describe, expect, it } from "vitest";
import { messages } from "@/i18n/messages";

describe("i18n messages", () => {
  it("all locales have the same keys as en", () => {
    const enKeys = Object.keys(messages.en).sort();
    for (const [locale, dict] of Object.entries(messages)) {
      const keys = Object.keys(dict).sort();
      expect(keys, locale).toEqual(enKeys);
    }
  });
});

