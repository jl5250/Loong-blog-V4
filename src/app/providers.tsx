"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
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
      try { orig.call(this, id); } catch { /* suppress */ }
    };
    (Element.prototype as any).releasePointerCapture = patched;
    return () => {
      (Element.prototype as any).releasePointerCapture = orig;
    };
  }, []);

  // Single bootstrap for Baidu analytics
  useEffect(() => {
    let cancelled = false;
    getOtherConfig()
      .then((res) => {
        if (cancelled) return;
        const token = res.data?.value?.baidu_token ?? "";
        injectBaiduAnalytics(token);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <ThemeProvider>
      <NavigationProgress />
      {children}
    </ThemeProvider>
  );
}
