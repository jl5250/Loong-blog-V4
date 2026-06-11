"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ── Smooth scroll animation with user-interrupt ── */
let currentRaf = 0;

function smoothScrollTo(targetY: number, duration = 800) {
  cancelAnimationFrame(currentRaf);

  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 1) return;

  const startTime = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  // Cancel animation if user scrolls manually
  let cancelled = false;
  const onUserScroll = () => { cancelled = true; };
  window.addEventListener("wheel", onUserScroll, { passive: true, once: true });
  window.addEventListener("touchmove", onUserScroll, { passive: true, once: true });

  const step = (now: number) => {
    if (cancelled) return;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) {
      currentRaf = requestAnimationFrame(step);
    } else {
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
    }
  };

  currentRaf = requestAnimationFrame(step);
}

/* ── Context ── */
interface ScrollContextValue {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | HTMLElement | string, immediate?: boolean) => void;
  onScroll: (cb: (scroll: number) => void) => void;
  offScroll: (cb: (scroll: number) => void) => void;
  scroll: number;
}

const ScrollCtx = createContext<ScrollContextValue | null>(null);

export function useLenis() {
  return useContext(ScrollCtx);
}

export function LenisScrollProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef(new Set<(scroll: number) => void>());
  const stoppedRef = useRef(false);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const listeners = listenersRef.current;

    const onScroll = () => {
      if (stoppedRef.current) return;
      const y = window.scrollY;
      setScrollPos(y);
      listeners.forEach((cb) => cb(y));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((target: number | HTMLElement | string, immediate = false) => {
    let y = 0;
    if (typeof target === "number") {
      y = target;
    } else if (target instanceof HTMLElement) {
      y = target.getBoundingClientRect().top + window.scrollY - 80;
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
    }
    if (immediate) {
      window.scrollTo(0, y);
    } else {
      smoothScrollTo(y);
    }
  }, []);

  const onScrollCb = useCallback((cb: (scroll: number) => void) => {
    listenersRef.current.add(cb);
  }, []);

  const offScrollCb = useCallback((cb: (scroll: number) => void) => {
    listenersRef.current.delete(cb);
  }, []);

  const stop = useCallback(() => { stoppedRef.current = true; }, []);
  const start = useCallback(() => { stoppedRef.current = false; }, []);

  const api: ScrollContextValue = {
    stop,
    start,
    scrollTo,
    onScroll: onScrollCb,
    offScroll: offScrollCb,
    scroll: scrollPos,
  };

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}
