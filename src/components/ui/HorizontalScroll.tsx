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
    el.addEventListener("mouseleave", () => { down = false; });

    // Use capture phase to intercept wheel before Lenis
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        lenis?.stop();
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
        // Resume Lenis after scroll stops
        clearTimeout((el as any)._lenisTimer);
        (el as any)._lenisTimer = setTimeout(() => lenis?.start(), 100);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", () => { down = false; });
      el.removeEventListener("wheel", onWheel);
      clearTimeout((el as any)._lenisTimer);
    };
  }, [lenis]);

  return (
    <div ref={ref} className={`overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none ${className}`} style={{ touchAction: "pan-y" }}>
      {children}
    </div>
  );
}
