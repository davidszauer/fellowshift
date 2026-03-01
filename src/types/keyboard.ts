export type KeyboardCode = string;

export type KeyZone = "pinky" | "ring" | "middle" | "index" | "thumb" | "none";

export type VirtualKeyDef = {
  code: KeyboardCode;
  label: string;
  zone: KeyZone;
  width?: number;
};

export type KeyboardLayout = {
  id: string;
  name: string;
  rows: VirtualKeyDef[][];
  codeToChar: Record<
    KeyboardCode,
    {
      lower: string;
      upper: string;
    }
  >;
};

export type InputEvent =
  | { kind: "char"; char: string; code: KeyboardCode; at: number }
  | { kind: "backspace"; code: "Backspace"; at: number }
  | { kind: "noop"; reason: string; code?: KeyboardCode; at: number };

export type InputMethod = {
  id: string;
  targetLanguage: string;
  layout: KeyboardLayout;
  mapKeyDown: (event: KeyboardEvent, at: number) => InputEvent;
  reverseLookup: (char: string) => KeyboardCode[];
};

