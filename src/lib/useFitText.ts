"use client";

import { useLayoutEffect, useRef } from "react";

type FitTextOptions = {
  deps: readonly unknown[];
  minFontSizePx: number;
};

function elementOverflows(el: HTMLElement) {
  // Tolerate sub-pixel rounding differences.
  const widthOverflow = el.scrollWidth - el.clientWidth > 1;
  const heightOverflow = el.scrollHeight - el.clientHeight > 1;
  return widthOverflow || heightOverflow;
}

export function useFitText<T extends HTMLElement>({ deps, minFontSizePx }: FitTextOptions) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let resizeObserver: ResizeObserver | null = null;

    const fit = () => {
      const element = ref.current;
      if (!element) return;

      // Reset to the stylesheet-defined size to measure a proper "max".
      element.style.fontSize = "";

      const computedFontSizePx = Number.parseFloat(getComputedStyle(element).fontSize);
      if (!Number.isFinite(computedFontSizePx)) return;

      // If the element isn't laid out yet, bail; a later resize will re-fit.
      if (element.clientWidth === 0 || element.clientHeight === 0) return;

      // If it already fits at the base size, keep it.
      if (!elementOverflows(element)) return;

      const low = Math.min(minFontSizePx, computedFontSizePx);
      let lo = low;
      let hi = computedFontSizePx;
      let best = low;

      // Binary search for the largest font size that fits.
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        element.style.fontSize = `${mid}px`;

        if (elementOverflows(element)) {
          hi = mid;
        } else {
          best = mid;
          lo = mid;
        }
      }

      element.style.fontSize = `${best}px`;
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Fit after layout settles.
        fit();
      });
    };

    schedule();

    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(el);
    if (el.parentElement) resizeObserver.observe(el.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      resizeObserver = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

