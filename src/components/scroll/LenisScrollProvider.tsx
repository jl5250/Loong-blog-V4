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
    const behavior = immediate ? "auto" : "smooth";
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior, block: "start" });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) (el as HTMLElement).scrollIntoView({ behavior, block: "start" });
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
