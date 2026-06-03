"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  from?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
  start?: string;
}

export function ScrollReveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.8,
  className = "",
  start = "top 85%",
}: ScrollRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const offsets = { up: { y: 48, x: 0 }, down: { y: -48, x: 0 }, left: { x: 48, y: 0 }, right: { x: -48, y: 0 }, fade: { x: 0, y: 0 } };
    const { x, y } = offsets[from];

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, x, y });
      ScrollTrigger.create({
        trigger: el,
        start,
        onEnter: () => {
          gsap.to(el, { opacity: 1, x: 0, y: 0, duration, delay, ease: "power2.out", overwrite: "auto" });
        },
        once: true,
      });
    });

    return () => ctx.revert();
  }, [from, delay, duration, start]);

  return <div ref={elRef} className={className}>{children}</div>;
}
