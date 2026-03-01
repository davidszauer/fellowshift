"use client";

import { useEffect, useState } from "react";

type LayoutMapState =
  | { status: "idle"; layoutMap: null }
  | { status: "loading"; layoutMap: null }
  | { status: "ready"; layoutMap: Map<string, string> }
  | { status: "unavailable"; layoutMap: null };

let cachedLayoutMap: Map<string, string> | null = null;
let cacheStatus: LayoutMapState["status"] = "idle";
let inFlight: Promise<Map<string, string> | null> | null = null;

async function loadLayoutMap(): Promise<Map<string, string> | null> {
  if (cachedLayoutMap) return cachedLayoutMap;
  if (cacheStatus === "unavailable") return null;

  if (!inFlight) {
    inFlight = (async () => {
      try {
        const keyboard: any = (navigator as any).keyboard;
        if (!keyboard?.getLayoutMap) {
          cacheStatus = "unavailable";
          return null;
        }
        const lm = (await keyboard.getLayoutMap()) as Map<string, string>;
        cachedLayoutMap = lm;
        cacheStatus = "ready";
        return lm;
      } catch {
        cacheStatus = "unavailable";
        return null;
      } finally {
        inFlight = null;
      }
    })();
  }

  return inFlight;
}

export function useKeyboardLayoutMap() {
  const [state, setState] = useState<LayoutMapState>(() => {
    if (cachedLayoutMap) return { status: "ready", layoutMap: cachedLayoutMap };
    if (cacheStatus === "unavailable") return { status: "unavailable", layoutMap: null };
    return { status: "idle", layoutMap: null };
  });

  useEffect(() => {
    let cancelled = false;
    if (cachedLayoutMap || cacheStatus === "unavailable") return;

    setState({ status: "loading", layoutMap: null });
    loadLayoutMap().then((lm) => {
      if (cancelled) return;
      if (lm) setState({ status: "ready", layoutMap: lm });
      else setState({ status: "unavailable", layoutMap: null });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

