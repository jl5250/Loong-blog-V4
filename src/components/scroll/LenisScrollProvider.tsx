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
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

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
    if (immediate) {
      if (typeof target === "number") {
        window.scrollTo(0, target);
      } else if (target instanceof HTMLElement) {
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 80);
      }
      return;
    }

    // GSAP smooth scroll — automatically cancels if user scrolls during animation
    const opts: gsap.TweenVars = {
      duration: 0.8,
      ease: "power3.out",
      overwrite: true,
    };

    if (typeof target === "number") {
      gsap.to(window, { ...opts, scrollTo: { y: target, autoKill: true } });
    } else if (target instanceof HTMLElement) {
      gsap.to(window, { ...opts, scrollTo: { y: target, offsetY: 80, autoKill: true } });
    } else if (typeof target === "string") {
      gsap.to(window, { ...opts, scrollTo: { y: target, offsetY: 80, autoKill: true } });
    }
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
