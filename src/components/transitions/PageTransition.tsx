"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Page transition wrapper — fade-in only (no transform, which would break fixed positioning).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transition = "opacity 0.4s ease";

    requestAnimationFrame(() => {
      el.style.opacity = "1";
    });
  }, []);

  return (
    <div ref={ref} className="flex-1 flex flex-col">
      {children}
    </div>
  );
}
