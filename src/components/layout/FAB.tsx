"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/scroll/LenisScrollProvider";
import { scrollDocumentTo } from "@/lib/scroll/scrollTo";

export function FAB() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lenis) {
      const onScroll = (scroll: number) => setVisible(scroll > 500);
      lenis.onScroll(onScroll);
      return () => lenis.offScroll(onScroll);
    }
    // Fallback for mobile / no-Lenis mode
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  if (pathname === "/xue") return null;

  const scrollToTop = () => {
    scrollDocumentTo(0, lenis, true);
  };

  return (
    <div className="fixed right-5 bottom-20 z-[99]">
      <button
        onClick={scrollToTop}
        className={`w-10 h-10 rounded-full border border-border bg-bg-surface/90 backdrop-blur-md cursor-pointer flex items-center justify-center text-sm text-text-muted shadow-card transition-all duration-300 hover:border-accent hover:text-accent hover:scale-110 ${
          visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        title="回到顶部"
      >
        ↑
      </button>
    </div>
  );
}
