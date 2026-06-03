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
  }, []);

  return (
    <ThemeProvider>
      <LenisScrollProvider>{children}</LenisScrollProvider>
    </ThemeProvider>
  );
}
