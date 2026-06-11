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

interface ScrollContextValue {
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
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const listeners = listenersRef.current;
    const onScroll = () => {
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
      return;
    }

    // Smooth scroll with GSAP-like ease, cancel on user interaction
    const startY = window.scrollY;
    const diff = y - startY;
    if (Math.abs(diff) < 1) return;

    let raf = 0;
    let cancelled = false;
    const startTime = performance.now();
    const duration = 800;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const onCancel = () => { cancelled = true; };
    window.addEventListener("wheel", onCancel, { passive: true, once: true });
    window.addEventListener("touchmove", onCancel, { passive: true, once: true });

    const step = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * ease(progress));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        window.removeEventListener("wheel", onCancel);
        window.removeEventListener("touchmove", onCancel);
      }
    };

    raf = requestAnimationFrame(step);
  }, []);

  const onScrollCb = useCallback((cb: (scroll: number) => void) => {
    listenersRef.current.add(cb);
  }, []);

  const offScrollCb = useCallback((cb: (scroll: number) => void) => {
    listenersRef.current.delete(cb);
  }, []);

  const api: ScrollContextValue = {
    scrollTo,
    onScroll: onScrollCb,
    offScroll: offScrollCb,
    scroll: scrollPos,
  };

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}
