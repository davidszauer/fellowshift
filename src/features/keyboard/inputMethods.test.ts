import { describe, expect, it } from "vitest";
import { getInputMethod } from "@/features/keyboard/inputMethods";

describe("EN input method mapping", () => {
  it("maps KeyA to 'a' (lowercase)", () => {
    const method = getInputMethod("us-qwerty");
    if (!method) throw new Error("missing method");
    const e = { code: "KeyA", shiftKey: false } as KeyboardEvent;
    const input = method.mapKeyDown(e, 0);
    expect(input.kind).toBe("char");
    if (input.kind === "char") expect(input.char).toBe("a");
  });
});

describe("RU input method mapping", () => {
  it("maps KeyF to 'а' (lowercase)", () => {
    const method = getInputMethod("us-qwerty-to-ru-jcuken");
    if (!method) throw new Error("missing method");
    const e = { code: "KeyF", shiftKey: false } as KeyboardEvent;
    const input = method.mapKeyDown(e, 0);
    expect(input.kind).toBe("char");
    if (input.kind === "char") expect(input.char).toBe("а");
  });

  it("maps KeyF with shift to 'А' (uppercase)", () => {
    const method = getInputMethod("us-qwerty-to-ru-jcuken");
    if (!method) throw new Error("missing method");
    const e = { code: "KeyF", shiftKey: true } as KeyboardEvent;
    const input = method.mapKeyDown(e, 0);
    expect(input.kind).toBe("char");
    if (input.kind === "char") expect(input.char).toBe("А");
  });
});

describe("HU input method mapping", () => {
  it("maps BracketLeft to 'ö' (lowercase)", () => {
    const method = getInputMethod("us-qwerty-to-hu-custom");
    if (!method) throw new Error("missing method");
    const e = { code: "BracketLeft", shiftKey: false } as KeyboardEvent;
    const input = method.mapKeyDown(e, 0);
    expect(input.kind).toBe("char");
    if (input.kind === "char") expect(input.char).toBe("ö");
  });

  it("maps Equal to 'Ő' with shift", () => {
    const method = getInputMethod("us-qwerty-to-hu-custom");
    if (!method) throw new Error("missing method");
    const e = { code: "Equal", shiftKey: true } as KeyboardEvent;
    const input = method.mapKeyDown(e, 0);
    expect(input.kind).toBe("char");
    if (input.kind === "char") expect(input.char).toBe("Ő");
  });
});

describe("OS layout input method", () => {
  it("uses event.key for printable characters", () => {
    const method = getInputMethod("os-layout");
    if (!method) throw new Error("missing method");
    const e = { code: "KeyE", key: "é" } as KeyboardEvent;
    const input = method.mapKeyDown(e, 0);
    expect(input.kind).toBe("char");
    if (input.kind === "char") expect(input.char).toBe("é");
  });
});
