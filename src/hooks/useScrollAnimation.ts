"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  /** ScrollTrigger start position */
  start?: string;
  /** Animation duration */
  duration?: number;
  /** Easing */
  ease?: string;
  /** Play once (clean up after) */
  once?: boolean;
}

/**
 * Animates an element when it scrolls into view.
 * Returns a ref to attach to the target element.
 *
 * @example
 * ```tsx
 * const ref = useScrollAnimation({ from: { y: 60 } });
 * return <div ref={ref}>Hello</div>;
 * ```
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  vars: gsap.TweenVars,
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const { start = "top 85%", duration = 0.8, ease = "power2.out", once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, ...vars });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        gsap.to(el, {
          ...vars,
          opacity: 1,
          duration,
          ease,
          overwrite: "auto",
          onComplete: once ? () => st.kill() : undefined,
        } as gsap.TweenVars & { opacity: number });
      },
      ...(once ? { once: true } : {}),
    });

    return () => st.kill();
  }, [start, duration, ease, once]);

  return ref;
}
