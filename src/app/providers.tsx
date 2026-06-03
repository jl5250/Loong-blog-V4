"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
import { LenisScrollProvider } from "@/components/scroll/LenisScrollProvider";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.history.scrollRestoration = "manual";
    } catch {}

    // Patch releasePointerCapture to suppress pointer capture errors in image viewer
    const orig = Element.prototype.releasePointerCapture;
    const patched = function (this: Element, id: number) {
      try { orig.call(this, id); } catch { /* suppress - lib calls releasePointerCapture without active pointer */ }
    };
    let mounted = true;
    (Element.prototype as any).releasePointerCapture = patched;
    return () => {
      mounted = false;
      (Element.prototype as any).releasePointerCapture = orig;
    };
  }, []);

  return (
    <ThemeProvider>
      <LenisScrollProvider>{children}</LenisScrollProvider>
    </ThemeProvider>
  );
}
