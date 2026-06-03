"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { getCateList } from "@/api/cate";
import { getThemeConfig } from "@/api/config";
import type { Cate } from "@/types/cate";
import type { ThemeConfig } from "@/types/config";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [cates, setCates] = useState<Cate[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [themeCfg, setThemeCfg] = useState<ThemeConfig | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Hierarchy: level-0 = top nav, level === parent.id = dropdown children
  const topCates = cates.filter((c) => c.level === 0);
  const getChildren = (parentId: number) =>
    cates.filter((c) => c.level === parentId);

  // Flatten nav items for mobile: all type="nav" items, dedup by url
  const seenUrls = new Set<string>();
  const navItems = cates
    .filter((c) => c.type === "nav" && c.url && c.url !== "#")
    .filter((c) => { if (seenUrls.has(c.url!)) return false; seenUrls.add(c.url!); return true; })
    .map((c) => ({ name: c.name, url: c.url || "/" }));
  // Home always first
  const mobileItems = [{ name: "首页", url: "/" }, ...navItems.filter((n) => n.url !== "/")];

  const isActive = (path: string) => {
    if (!path) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/") || pathname.startsWith(path + "?");
  };

  /** Check if a category should be highlighted based on its URL or mark matching the current pathname */
  const isCateActive = (mark: string, cateId?: number, url?: string) => {
    if (!mark) return false;
    // Check by URL field (most reliable for nav items with custom URLs)
    if (url && url !== "#" && url !== "/") {
      if (url === pathname || pathname.startsWith(url + "/")) return true;
    }
    // Direct path match: e.g. mark="data" → pathname="/data"
    if (pathname === `/${mark}` || pathname.startsWith(`/${mark}/`)) return true;
    // /cate/{id} match as fallback
    if (cateId && (pathname === `/cate/${cateId}` || pathname.startsWith(`/cate/${cateId}/`))) return true;
    // Handle multi-segment marks like "wall/all"
    if (mark.includes("/") && pathname.startsWith(`/${mark}`)) return true;
    return false;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${scrolled ? "bg-bg-primary/70 backdrop-blur-md border-border/50" : "bg-transparent border-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between overflow-visible">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-2 md:gap-0">
          {/* Hamburger — visible on mobile only */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-sm text-text-muted hover:text-accent transition-colors flex-shrink-0"
            aria-label="菜单">
            <span className="flex flex-col gap-[3px]">
              <span className={`block w-4 h-px bg-current transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`block w-4 h-px bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-px bg-current transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </span>
          </button>
          <Link href="/" className="flex items-center shrink-0">
            {themeCfg ? (
              <img
                src={theme === "dark" ? themeCfg.dark_logo : themeCfg.light_logo}
                alt="Logo"
                className="h-10 w-auto hover:scale-90 transition-transform"
              />
            ) : (
              <span className="font-calligraphy text-xl hover:text-accent transition-colors" style={{ color: theme === "dark" ? "#e8e4de" : "#2c1810" }}>Loong·Blog</span>
            )}
          </Link>
        </div>

        {/* Center: desktop nav */}
        <div className="hidden md:flex items-center gap-5 overflow-visible">
          <Link href="/" className={`font-sans text-sm tracking-wider uppercase transition-colors ${isActive("/") && pathname === "/" ? "text-accent" : "text-text-body/80 hover:text-accent"}`}>首页</Link>

          {topCates.map((c) => {
            const isNav = c.type === "nav";
            const linkHref = isNav ? (c.url || "#") : `/cate/${c.id}`;
            const children = getChildren(c.id!);

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

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/search" className="w-9 h-9 rounded-full border border-border bg-bg-surface/80 flex items-center justify-center text-xs text-text-muted hover:border-accent hover:text-accent transition-colors" aria-label="搜索">🔍</Link>
          <button onClick={toggleTheme} className="w-9 h-9 rounded-full border border-border bg-bg-surface/80 flex items-center justify-center text-sm hover:border-accent hover:bg-bg-surface transition-colors" aria-label="切换主题">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

      </nav>

      {/* ───── Mobile drawer (from left) ───── */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-[280px] max-w-[80vw] bg-bg-surface border-r border-border transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
    </header>
  );
}
