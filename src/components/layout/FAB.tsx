"use client";

import { usePathname } from "next/navigation";
import { useLenis } from "@/components/scroll/LenisScrollProvider";
import { useDocumentScroll } from "@/lib/scroll/useDocumentScroll";
import { scrollDocumentTo } from "@/lib/scroll/scrollTo";

export function FAB() {
  const pathname = usePathname();
  if (pathname === "/xue") return null;

  const lenis = useLenis();
  const visible = useDocumentScroll((scrollY) => scrollY > 500);

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
