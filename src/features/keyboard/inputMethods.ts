import type { InputMethod } from "@/types/keyboard";
import { ruJcukenLayout } from "@/features/keyboard/layouts/ruJcuken";
import { buildReverseLookup } from "@/features/keyboard/utils/reverseLookup";
import { usQwertyLayout } from "@/features/keyboard/layouts/usQwerty";
import { huCustomLayout } from "@/features/keyboard/layouts/huCustom";

function makeMappedInputMethod(params: {
  id: string;
  targetLanguage: string;
  layout: InputMethod["layout"];
}): InputMethod {
  const reverse = buildReverseLookup(params.layout);
  return {
    id: params.id,
    targetLanguage: params.targetLanguage,
    layout: params.layout,
    mapKeyDown: (event, at) => {
      if (event.code === "Backspace") return { kind: "backspace", code: "Backspace", at };
      const entry = params.layout.codeToChar[event.code];
      if (!entry) return { kind: "noop", reason: "unmapped", code: event.code, at };
      const char = event.shiftKey ? entry.upper : entry.lower;
      return { kind: "char", char, code: event.code, at };
    },
    reverseLookup: (char) => reverse(char),
  };
}

const enInputMethod = makeMappedInputMethod({
  id: "us-qwerty",
  targetLanguage: "en",
  layout: usQwertyLayout,
});

const ruInputMethod = makeMappedInputMethod({
  id: "us-qwerty-to-ru-jcuken",
  targetLanguage: "ru",
  layout: ruJcukenLayout,
});

const huInputMethod = makeMappedInputMethod({
  id: "us-qwerty-to-hu-custom",
  targetLanguage: "hu",
  layout: huCustomLayout,
});

let osLayoutCache: Map<string, string[]> | null = null;
let osLayoutInitStarted = false;

function osReverseLookup(char: string) {
  if (!osLayoutCache && !osLayoutInitStarted && typeof navigator !== "undefined") {
    const keyboard: any = (navigator as any).keyboard;
    if (keyboard?.getLayoutMap) {
      osLayoutInitStarted = true;
      keyboard
        .getLayoutMap()
        .then((layoutMap: Map<string, string>) => {
          const inverse = new Map<string, string[]>();
          for (const [code, value] of layoutMap.entries()) {
            const arr = inverse.get(value) ?? [];
            if (!arr.includes(code)) arr.push(code);
            inverse.set(value, arr);
          }
          osLayoutCache = inverse;
        })
        .catch(() => {
          osLayoutCache = new Map();
        });
    }
  }
  const direct = osLayoutCache?.get(char) ?? [];
  if (direct.length > 0) return direct;
  if (char === " ") return ["Space"];
  if (char.length !== 1) return [];
  const lower = char.toLocaleLowerCase();
  const upper = char.toLocaleUpperCase();
  const lowerCodes = osLayoutCache?.get(lower) ?? [];
  if (lowerCodes.length > 0) return lowerCodes;
  const upperCodes = osLayoutCache?.get(upper) ?? [];
  if (upperCodes.length > 0) return upperCodes;
  return [];
}

const osLayoutInputMethod: InputMethod = {
  id: "os-layout",
  targetLanguage: "und",
  layout: usQwertyLayout,
  mapKeyDown: (event, at) => {
    if (event.code === "Backspace") return { kind: "backspace", code: "Backspace", at };
    if (event.key.length !== 1) return { kind: "noop", reason: "unmapped", code: event.code, at };
    return { kind: "char", char: event.key, code: event.code, at };
  },
  reverseLookup: (char) => osReverseLookup(char),
};

const registry: Record<string, InputMethod> = {
  [enInputMethod.id]: enInputMethod,
  [ruInputMethod.id]: ruInputMethod,
  [huInputMethod.id]: huInputMethod,
  [osLayoutInputMethod.id]: osLayoutInputMethod,
};

export function getInputMethod(id: string) {
  return registry[id];
}

export const defaultInputMethodId = osLayoutInputMethod.id;
