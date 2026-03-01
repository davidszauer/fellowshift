import type { GameStore } from "@/store/useGameStore";

export const selectPromptMode = (s: GameStore) => s.promptMode;
export const selectSpacingMode = (s: GameStore) => s.spacingMode;
export const selectDisplay = (s: GameStore) => s.display;
export const selectTransliteration = (s: GameStore) => s.display.transliterationLatin ?? "";
export const selectHintLanguage = (s: GameStore) => s.hintLanguage;

export const selectWpmGross = (s: GameStore) => s.wpm.grossLive;
export const selectWpmNet = (s: GameStore) => s.wpm.netLive;
export const selectAccuracy = (s: GameStore) => s.accuracyLive;
export const selectCombo = (s: GameStore) => s.combo;

export const selectTarget = (s: GameStore) => s.target;
export const selectActiveIndex = (s: GameStore) => s.activeIndex;
export const selectErrorPulse = (s: GameStore) => s.error;
export const selectInputMethodId = (s: GameStore) => s.inputMethodId;

export const selectPressedCodes = (s: GameStore) => s.pressedCodes;
export const selectExpectedCodes = (s: GameStore) => s.expectedCodes;
export const selectLastKeyPulse = (s: GameStore) => s.lastKeyPulse;

export const selectNodes = (s: GameStore) => s.nodes;
export const selectCurrentNodeIndex = (s: GameStore) => s.currentNodeIndex;
export const selectCurrentLessonIndex = (s: GameStore) => s.currentLessonIndex;
export const selectPlayerLevel = (s: GameStore) => s.playerLevel;
export const selectIsPro = (s: GameStore) => s.playerLevel >= 20;

export const selectKeyboardHidden = (s: GameStore) => s.keyboardHidden;

export const selectStatus = (s: GameStore) => s.status;
