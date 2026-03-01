import type { KeyboardLayout, KeyboardCode } from "@/types/keyboard";

export function buildReverseLookup(layout: KeyboardLayout) {
  const map = new Map<string, KeyboardCode[]>();
  for (const [code, chars] of Object.entries(layout.codeToChar)) {
    for (const ch of [chars.lower, chars.upper]) {
      const arr = map.get(ch) ?? [];
      if (!arr.includes(code)) arr.push(code);
      map.set(ch, arr);
    }
  }
  return (char: string): KeyboardCode[] => map.get(char) ?? [];
}

