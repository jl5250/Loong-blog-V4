"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type SplitType = "chars" | "words" | "lines";

interface SplitTextHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4";
  split?: SplitType;
  /** GSAP ease for the reveal */
  ease?: string;
  /** Stagger delay between each unit */
  stagger?: number;
  /** Duration per unit */
  duration?: number;
  /** Scroll trigger start */
  start?: string;
  className?: string;
}

export function SplitTextHeading({
  text,
  as: Tag = "h2",
  split = "chars",
  ease = "power3.out",
  stagger = 0.03,
  duration = 0.6,
  start = "top 85%",
  className = "",
}: SplitTextHeadingProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Store original text
    el.textContent = text;

    const splitText = new SplitText(el, {
      type: split,
    });

    const units = splitText[split] ?? [];
    if (units.length === 0) return;

    // Set initial state
    gsap.set(units, {
      opacity: 0,
      y: split === "lines" ? 24 : 32,
      rotateX: split === "chars" ? -90 : 0,
      transformOrigin: "50% 50% -50%",
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        gsap.to(units, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration,
          stagger,
          ease,
          overwrite: "auto",
        });
      },
      once: true,
    });

    return () => {
      st.kill();
      splitText.revert();
    };
  }, [text, split, ease, stagger, duration, start]);

  return (
    <Tag ref={containerRef} className={className} aria-label={text} />
  );
}
