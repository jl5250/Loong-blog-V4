"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/scroll/LenisScrollProvider";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Drag to scroll
    let down = false, sx = 0, sl = 0;
    const onDown = (e: MouseEvent) => { down = true; sx = e.clientX; sl = el.scrollLeft; };
    const onMove = (e: MouseEvent) => { if (!down) return; e.preventDefault(); el.scrollLeft = sl + (sx - e.clientX) * 1.5; };
    const onUp = () => { down = false; };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    // Edge-aware wheel: consume when container can still scroll, pause Lenis
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      const atLeft = el.scrollLeft <= 0;
      const maxLeft = el.scrollWidth - el.clientWidth;
      const atRight = el.scrollLeft >= maxLeft - 1;
      const movingLeft = e.deltaY < 0;
      const movingRight = e.deltaY > 0;

      const canConsume = (movingLeft && !atLeft) || (movingRight && !atRight);
      if (!canConsume) return;

      e.preventDefault();
      e.stopPropagation();
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
    };

    // Pause Lenis on hover, resume on leave
    const onEnter = () => { lenis?.stop(); };
    const onLeave = () => { lenis?.start(); down = false; };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      lenis?.start();
    };
  }, [lenis]);

  return (
    <div ref={ref} className={`overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none ${className}`} style={{ touchAction: "pan-y" }}>
      {children}
    </div>
  );
}
