"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { getCateList } from "@/api/cate";
import { getThemeConfig } from "@/api/config";
import { useLenis } from "@/components/scroll/LenisScrollProvider";
import type { Cate } from "@/types/cate";
import type { ThemeConfig } from "@/types/config";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [cates, setCates] = useState<Cate[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [themeCfg, setThemeCfg] = useState<ThemeConfig | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll state: Lenis on desktop, native on mobile
  useEffect(() => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.2 : 150;
    if (lenis) {
      const onScroll = (scroll: number) => setScrolled(scroll > threshold);
      lenis.onScroll(onScroll);
      return () => lenis.offScroll(onScroll);
    }
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  useEffect(() => {
    getCateList().then((res) => {
      const list = (res.data as any)?.result ?? (Array.isArray(res.data) ? res.data : []);
      setCates(list);
    }).catch(() => { console.warn("[Header] Failed to fetch category list"); });
  }, []);

  useEffect(() => {
    getThemeConfig().then((res) => {
      if (res.code === 200 && res.data?.value) setThemeCfg(res.data.value);
    }).catch(() => { console.warn("[Header] Failed to fetch theme config"); });
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  // API returns tree structure: top-level items with nested children
  const topCates = cates.filter((c) => !c.isHide && c.name !== "首页" && c.url !== "/");

  // Flatten tree for mobile: recursively collect all nav items
  const flattenNav = (items: Cate[]): { name: string; url: string }[] => {
    const result: { name: string; url: string }[] = [];
    for (const c of items) {
      if (c.isHide) continue;
      if (c.type === "nav" && c.url && c.url !== "#") {
        result.push({ name: c.name, url: c.url || "/" });
      }
      if (c.children?.length) {
        result.push(...flattenNav(c.children));
      }
    }
    return result;
  };
  const seenUrls = new Set<string>();
  const navItems = flattenNav(cates)
    .filter((n) => { if (seenUrls.has(n.url)) return false; seenUrls.add(n.url); return true; });
  const mobileItems = [{ name: "首页", url: "/" }, ...navItems.filter((n) => n.url !== "/")];

  const isCateActive = (mark: string, cateId?: number, url?: string) => {
    if (!mark) return false;
    if (url && url !== "#" && url !== "/") {
      if (url === pathname || pathname.startsWith(url + "/")) return true;
    }
    if (pathname === `/${mark}` || pathname.startsWith(`/${mark}/`)) return true;
    if (cateId && (pathname === `/cate/${cateId}` || pathname.startsWith(`/cate/${cateId}/`))) return true;
    if (mark.includes("/") && pathname.startsWith(`/${mark}`)) return true;
    return false;
  };

  return (
    <>
      <style>{`
        .hdr {
          background-color: transparent;
          transition: background-color 0.5s ease, border-color 0.5s ease;
        }
        .hdr.scrolled {
          background-color: var(--bg-primary);
        }
        /* Mobile drawer overlay */
        .drawer-overlay {
          background: rgba(0,0,0,0.4);
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }
        /* Mobile drawer panel */
        .drawer-panel {
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
        }
        @media (prefers-color-scheme: dark) {
          .drawer-overlay { background: rgba(0,0,0,0.5); }
        }
        [data-theme="dark"] .drawer-overlay { background: rgba(0,0,0,0.5); }
      `}</style>

      <header
        className={`hdr fixed top-0 left-0 right-0 z-50 h-16 border-b backdrop-blur-md ${scrolled ? "scrolled border-border/70" : "border-transparent"}`}
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* ── Left: Hamburger + Logo ── */}
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden relative z-50 w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-accent transition-colors flex-shrink-0"
              aria-label="菜单"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="block w-4 h-px bg-current rounded-full" />
                <span className="block w-4 h-px bg-current rounded-full" />
                <span className="block w-4 h-px bg-current rounded-full" />
              </span>
            </button>
            <Link href="/" className="flex items-center shrink-0 ml-1">
              {themeCfg ? (
                <img
                  src={theme === "dark" ? themeCfg.dark_logo : themeCfg.light_logo}
                  alt="Logo"
                  className="h-8 md:h-10 w-auto hover:scale-90 transition-transform"
                />
              ) : (
                <span className="font-calligraphy text-lg md:text-xl hover:text-accent transition-colors" style={{ color: theme === "dark" ? "#e8e4de" : "#2c1810" }}>Loong·Blog</span>
              )}
            </Link>
          </div>

          {/* ── Center: Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/" className={`font-sans text-sm tracking-wider uppercase transition-colors ${pathname === "/" ? "text-accent" : "text-text-body/80 hover:text-accent"}`}>首页</Link>
            {topCates.map((c) => {
              const isNav = c.type === "nav";
              const linkHref = isNav ? (c.url || "#") : `/cate/${c.id}`;
              const children = (c.children ?? []).filter((ch) => !ch.isHide);
              if (children.length > 0) {
                return (
                  <div key={c.id} className="relative" onMouseEnter={() => setOpenDropdown(c.id!)} onMouseLeave={() => setOpenDropdown(null)}>
                    <Link href={linkHref}
                      className={`font-sans text-sm tracking-wider uppercase transition-colors flex items-center gap-1 ${isCateActive(c.mark, c.id, c.url) ? "text-accent" : "text-text-body/80 hover:text-accent"}`}>
                      {c.name}<span className="text-[.5rem] mt-0.5">▼</span>
                    </Link>
                    {openDropdown === c.id && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-44">
                        <div className="rounded-xl border border-border bg-bg-surface backdrop-blur-2xl shadow-xl overflow-hidden">
                          {children.map((child) => {
                            const childHref = child.type === "nav" ? (child.url || "#") : `/cate/${child.id}`;
                            return (
                              <Link key={child.id} href={childHref} onClick={() => setOpenDropdown(null)}
                                className={`block px-4 py-2.5 text-sm font-sans transition-colors border-b border-border/50 last:border-0 ${isCateActive(child.mark, child.id, child.url) ? "text-accent2 bg-accent2/5" : "text-text-body/80 hover:text-accent hover:bg-bg-card"}`}>
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link key={c.id} href={linkHref}
                  className={`font-sans text-sm tracking-wider uppercase transition-colors ${isCateActive(c.mark, c.id, c.url) ? "text-accent" : "text-text-body/80 hover:text-accent"}`}>
                  {c.name}
                </Link>
              );
            })}
          </div>

          {/* ── Right: Search + Theme ── */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/search" className="w-9 h-9 rounded-full border border-border bg-bg-surface/80 flex items-center justify-center text-xs text-text-muted hover:border-accent hover:text-accent transition-colors" aria-label="搜索">🔍</Link>
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full border border-border bg-bg-surface/80 flex items-center justify-center text-sm hover:border-accent hover:bg-bg-surface transition-colors" aria-label="切换主题">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Overlay */}
        <div className="drawer-overlay absolute inset-0" onClick={() => setMobileMenuOpen(false)} />

        {/* Panel */}
        <div
          className={`drawer-panel absolute top-0 left-0 h-full w-[260px] max-w-[50vw] transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="pt-20 pb-6 px-6 overflow-y-auto h-full">
            <div className="space-y-1">
              {mobileItems.map((item, i) => (
                <Link key={i} href={item.url} onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-sans transition-colors ${
                    pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-text-body/80 hover:bg-bg-card hover:text-accent"
                  }`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
