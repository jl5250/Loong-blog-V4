"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisContextValue {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number, immediate?: boolean) => void;
}

const LenisCtx = createContext<LenisContextValue | null>(null);

export function useLenis() {
  return useContext(LenisCtx);
}

export function LenisScrollProvider({ children }: LenisScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisApi, setLenisApi] = useState<LenisContextValue | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    setLenisApi({
      stop: () => lenis.stop(),
      start: () => lenis.start(),
      scrollTo: (target: number, immediate = false) => {
        lenis.scrollTo(target, { immediate, lock: true });
      },
    });

    /* ---- Lenis ↔ GSAP ScrollTrigger bridge ---- */
    lenis.on("scroll", ScrollTrigger.update);

    const gsapTicker = gsap.ticker;
    const raf = (time: number) => lenis.raf(time * 1000);
    gsapTicker.add(raf);
    gsapTicker.lagSmoothing(0);

    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        console.log("[LoongBlog] Lenis initialized ✓");
      }, 1000);
    }

    return () => {
      lenis.destroy();
      gsapTicker.remove(raf);
      gsapTicker.lagSmoothing(1.33);
    };
  }, []);

  return <LenisCtx.Provider value={lenisApi}>{children}</LenisCtx.Provider>;
}

interface LenisScrollProviderProps {
  children: ReactNode;
}
