import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import type { Campaign, Lesson } from "@/types/campaign";
import type { InputEvent } from "@/types/keyboard";
import type { PromptMode, SessionState, SpacingMode, TypingResult } from "@/types/typing";
import { normalizeTargetText } from "@/features/typing/engine/normalize";
import { reduceTyping } from "@/features/typing/engine/typingEngine";
import { computeLiveMetrics, computeFinalMetrics, type RingEvent } from "@/features/typing/engine/metrics";
import { getInputMethod } from "@/features/keyboard/inputMethods";
import { findLessonPosition } from "@/features/progression/utils/progression";
import type { LearningLanguage, UiLanguage } from "@/types/i18n";
import type { LocalizedText } from "@/types/localizedText";

type KeyboardSlice = {
  pressedCodes: Record<string, true>;
  expectedCodes: string[];
  lastKeyPulse?: { code: string; at: number; correctness?: "correct" | "incorrect" };
  keyDown: (code: string, at: number) => void;
  keyUp: (code: string, at: number) => void;
  clearPressed: () => void;
  setExpectedCodes: (codes: string[]) => void;
  pulseKey: (pulse: { code: string; at: number; correctness?: "correct" | "incorrect" }) => void;
};

type StatsSlice = {
  startedAt?: number;
  endedAt?: number;
  keystrokesTotal: number;
  keystrokesCorrect: number;
  keystrokesIncorrect: number;
  backspaces: number;
  combo: number;
  comboBest: number;
  accuracyLive: number;
  wpm: { grossLive: number; netLive: number; grossFinal?: number; netFinal?: number };
  eventsRing: RingEvent[];
  resetStats: () => void;
  onStart: (now: number) => void;
  onResult: (result: TypingResult) => void;
  onComplete: (now: number) => void;
};

type ProgressionSlice = {
  nodes: Array<{ id: string; label: LocalizedText; lessonIds: string[] }>;
  currentNodeIndex: number;
  currentLessonIndex: number;
  completedLessons: Record<string, true>;
  playerLevel: number;
  loadCampaign: (campaign: Campaign) => void;
  setLessonPosition: (campaign: Campaign, lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  advanceToNextLesson: () => void;
};

type UiSlice = {
  keyboardHidden: boolean;
  setKeyboardHidden: (hidden: boolean) => void;
  toggleKeyboardHidden: () => void;
};

type SettingsSlice = {
  hintLanguage: "auto" | UiLanguage;
  setHintLanguage: (value: "auto" | UiLanguage) => void;
  defaultInputMethodByLearningLanguage: Record<LearningLanguage, string>;
  setDefaultInputMethodForLearningLanguage: (language: LearningLanguage, inputMethodId: string) => void;
};

type SessionSlice = {
  status: SessionState["status"];
  campaignId: string;
  lessonId: string;
  inputMethodId: string;
  promptMode: PromptMode;
  spacingMode: SpacingMode;
  target: string;
  display: SessionState["display"];
  typed: string;
  activeIndex: number;
  error: SessionState["error"];
  loadLesson: (payload: { campaign: Campaign; lesson: Lesson }) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  complete: () => void;
  setPromptMode: (mode: PromptMode) => void;
  setSpacingMode: (mode: SpacingMode) => void;
  applyInput: (input: InputEvent) => void;
};

export type GameStore = SessionSlice & KeyboardSlice & StatsSlice & ProgressionSlice & UiSlice & SettingsSlice;

const initialSession: Pick<
  SessionSlice,
  | "status"
  | "campaignId"
  | "lessonId"
  | "inputMethodId"
  | "promptMode"
  | "spacingMode"
  | "target"
  | "display"
  | "typed"
  | "activeIndex"
  | "error"
> = {
  status: "idle",
  campaignId: "",
  lessonId: "",
  inputMethodId: "",
  promptMode: "translation",
  spacingMode: "continuous",
  target: "",
  display: { translation: {}, transliterationLatin: "" },
  typed: "",
  activeIndex: 0,
  error: {},
};

const initialKeyboard: Pick<KeyboardSlice, "pressedCodes" | "expectedCodes"> = {
  pressedCodes: {},
  expectedCodes: [],
};

const initialStats: Omit<StatsSlice, "resetStats" | "onStart" | "onResult" | "onComplete"> = {
  startedAt: undefined,
  endedAt: undefined,
  keystrokesTotal: 0,
  keystrokesCorrect: 0,
  keystrokesIncorrect: 0,
  backspaces: 0,
  combo: 0,
  comboBest: 0,
  accuracyLive: 100,
  wpm: { grossLive: 0, netLive: 0 },
  eventsRing: [],
};

const initialProgression: Omit<
  ProgressionSlice,
  "loadCampaign" | "setLessonPosition" | "markLessonComplete" | "advanceToNextLesson"
> = {
  nodes: [],
  currentNodeIndex: 0,
  currentLessonIndex: 0,
  completedLessons: {},
  playerLevel: 24,
};

const initialUi: Pick<UiSlice, "keyboardHidden"> = {
  keyboardHidden: false,
};

const initialSettings: Pick<
  SettingsSlice,
  "hintLanguage" | "defaultInputMethodByLearningLanguage"
> = {
  hintLanguage: "auto",
  defaultInputMethodByLearningLanguage: {
    en: "os-layout",
    ru: "os-layout",
    hu: "os-layout",
  },
};

function computeExpectedCodes(target: string, activeIndex: number, inputMethodId: string) {
  const expectedChar = target[activeIndex] ?? "";
  if (!expectedChar) return [];
  const inputMethod = getInputMethod(inputMethodId);
  return inputMethod ? inputMethod.reverseLookup(expectedChar) : [];
}

function advanceOverSpacesForward(target: string, typed: string, activeIndex: number) {
  let nextIndex = activeIndex;
  while (target[nextIndex] === " ") nextIndex += 1;
  if (nextIndex === activeIndex) return { typed, activeIndex };
  return { typed: typed + " ".repeat(nextIndex - activeIndex), activeIndex: nextIndex };
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialSession,
        ...initialKeyboard,
        ...initialStats,
        ...initialProgression,
        ...initialUi,
        ...initialSettings,

        setKeyboardHidden: (hidden) => set({ keyboardHidden: hidden }),
        toggleKeyboardHidden: () => set((state) => ({ keyboardHidden: !state.keyboardHidden })),

        setHintLanguage: (value) => set({ hintLanguage: value }),
        setDefaultInputMethodForLearningLanguage: (language, inputMethodId) =>
          set((state) => ({
            defaultInputMethodByLearningLanguage: {
              ...state.defaultInputMethodByLearningLanguage,
              [language]: inputMethodId,
            },
          })),

        loadCampaign: (campaign) => {
          set({ nodes: campaign.nodes.map((n) => ({ ...n })) });
        },
        setLessonPosition: (campaign, lessonId) => {
          const pos = findLessonPosition(campaign, lessonId);
          if (!pos) return;
          set({ currentNodeIndex: pos.nodeIndex, currentLessonIndex: pos.lessonIndex });
        },
        markLessonComplete: (lessonId) => {
          set((state) => ({ completedLessons: { ...state.completedLessons, [lessonId]: true } }));
        },
        advanceToNextLesson: () => {
          const { nodes, currentNodeIndex, currentLessonIndex } = get();
          const node = nodes[currentNodeIndex];
          if (!node) return;
          const nextLessonIndex = currentLessonIndex + 1;
          if (nextLessonIndex < node.lessonIds.length) {
            set({ currentLessonIndex: nextLessonIndex });
            return;
          }
          const nextNodeIndex = currentNodeIndex + 1;
          if (nextNodeIndex < nodes.length) {
            set({ currentNodeIndex: nextNodeIndex, currentLessonIndex: 0 });
          }
        },

        resetStats: () => set({ ...initialStats }),
        onStart: (now) =>
          set({
            startedAt: now,
            endedAt: undefined,
            wpm: { grossLive: 0, netLive: 0 },
            accuracyLive: 100,
            eventsRing: [],
            combo: 0,
            comboBest: 0,
          }),
        onResult: (result) => {
          set((state) => {
        let combo = state.combo;
        let comboBest = state.comboBest;

        const isBackspace = result.kind === "backspace";
        const isCorrect = result.kind === "correct";
        const isIncorrect = result.kind === "incorrect";

        if (isCorrect) combo = combo + 1;
        if (isIncorrect) combo = 0;
        comboBest = Math.max(comboBest, combo);

        const eventsRing = [...state.eventsRing];
        if (isCorrect || isIncorrect) eventsRing.push({ at: result.at, correct: isCorrect });
        const { grossLive, netLive, accuracyLive, prunedRing } = computeLiveMetrics(
          eventsRing,
          result.at,
        );

        return {
          keystrokesTotal: state.keystrokesTotal + (isBackspace || isCorrect || isIncorrect ? 1 : 0),
          keystrokesCorrect: state.keystrokesCorrect + (isCorrect ? 1 : 0),
          keystrokesIncorrect: state.keystrokesIncorrect + (isIncorrect ? 1 : 0),
          backspaces: state.backspaces + (isBackspace ? 1 : 0),
          combo,
          comboBest,
          wpm: { ...state.wpm, grossLive, netLive },
          accuracyLive,
          eventsRing: prunedRing,
        };
          });
        },
        onComplete: (now) => {
          const state = get();
          if (!state.startedAt) return;
          const { grossFinal, netFinal } = computeFinalMetrics(
            state.keystrokesCorrect,
            state.keystrokesIncorrect,
            state.startedAt,
            now,
          );
          set({ endedAt: now, wpm: { ...state.wpm, grossFinal, netFinal } });
        },

        keyDown: (code) => set((state) => ({ pressedCodes: { ...state.pressedCodes, [code]: true } })),
        keyUp: (code) =>
          set((state) => {
            if (!state.pressedCodes[code]) return state;
            const next = { ...state.pressedCodes };
            delete next[code];
            return { pressedCodes: next };
          }),
        clearPressed: () => set({ pressedCodes: {} }),
        setExpectedCodes: (codes) => set({ expectedCodes: codes }),
        pulseKey: (pulse) => set({ lastKeyPulse: pulse }),

        loadLesson: ({ campaign, lesson }) => {
      const target = normalizeTargetText(lesson.targetText);
      const spacingMode = get().spacingMode;
      const advanced = spacingMode === "continuous" ? advanceOverSpacesForward(target, "", 0) : { typed: "", activeIndex: 0 };
      const expectedCodes = computeExpectedCodes(target, advanced.activeIndex, lesson.inputMethodId);

      set({
        status: "idle",
        campaignId: campaign.id,
        lessonId: lesson.id,
        inputMethodId: lesson.inputMethodId,
        target,
        display: lesson.display,
        typed: advanced.typed,
        activeIndex: advanced.activeIndex,
        error: {},
        expectedCodes,
        pressedCodes: {},
      });

      get().loadCampaign(campaign);
      get().setLessonPosition(campaign, lesson.id);
          get().resetStats();
        },
        start: () => {
      const state = get();
      if (state.status !== "idle") return;
      const now = Date.now();
      set({ status: "running" });
      get().onStart(now);
        },
        pause: () => set((state) => (state.status === "running" ? { status: "paused" } : state)),
        resume: () => set((state) => (state.status === "paused" ? { status: "running" } : state)),
        restart: () => {
      const state = get();
      const advanced =
        state.spacingMode === "continuous"
          ? advanceOverSpacesForward(state.target, "", 0)
          : { typed: "", activeIndex: 0 };
      const expectedCodes = computeExpectedCodes(state.target, advanced.activeIndex, state.inputMethodId);
      set({
        status: "idle",
        typed: advanced.typed,
        activeIndex: advanced.activeIndex,
        error: {},
        expectedCodes,
        pressedCodes: {},
      });
      get().resetStats();
        },
        complete: () => {
      const state = get();
      if (state.status === "completed") return;
      set({ status: "completed" });
      get().onComplete(Date.now());
      get().markLessonComplete(state.lessonId);
        },
        setPromptMode: (mode) => set({ promptMode: mode }),
        setSpacingMode: (mode) => {
      const state = get();
      if (state.spacingMode === mode) return;

      if (mode !== "continuous") {
        set({ spacingMode: mode });
        return;
      }

      const advanced = advanceOverSpacesForward(state.target, state.typed, state.activeIndex);
      set({ spacingMode: mode, typed: advanced.typed, activeIndex: advanced.activeIndex });

      if (advanced.activeIndex >= state.target.length && state.target.length > 0) {
        get().complete();
      }
        },

        applyInput: (input) => {
      const state = get();
      if (state.status !== "running") return;

      const { next, result, pulse } = reduceTyping(
        {
          target: state.target,
          typed: state.typed,
          activeIndex: state.activeIndex,
        },
        input,
        { spacingMode: state.spacingMode },
      );

      const nextError =
        result.kind === "incorrect" ? { at: result.at, index: next.activeIndex } : state.error;

      set({
        typed: next.typed,
        activeIndex: next.activeIndex,
        error: nextError,
      });

      if (pulse) get().pulseKey(pulse);
      get().onResult(result);

      const expectedCodes = computeExpectedCodes(state.target, next.activeIndex, state.inputMethodId);
      get().setExpectedCodes(expectedCodes);

      if (next.activeIndex >= state.target.length && state.target.length > 0) {
        get().complete();
      }
        },
      }),
      {
        name: "fellowshift-settings",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          hintLanguage: state.hintLanguage,
          defaultInputMethodByLearningLanguage: state.defaultInputMethodByLearningLanguage,
        }),
      },
    ),
  ),
);
