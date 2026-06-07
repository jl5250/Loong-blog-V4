"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
import { LenisScrollProvider } from "@/components/scroll/LenisScrollProvider";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { getOtherConfig } from "@/api/config";
import { injectBaiduAnalytics } from "@/lib/analytics/baidu";

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

  // Single bootstrap for Baidu analytics — fetch config once, inject once, silently fail
  useEffect(() => {
    let cancelled = false;
    getOtherConfig()
      .then((res) => {
        if (cancelled) return;
        const token = res.data?.value?.baidu_token ?? "";
        injectBaiduAnalytics(token);
      })
      .catch(() => {
        // analytics bootstrap must fail silently
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <ThemeProvider>
      <NavigationProgress />
      <LenisScrollProvider>{children}</LenisScrollProvider>
    </ThemeProvider>
  );
}
