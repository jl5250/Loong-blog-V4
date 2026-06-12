"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Article } from "@/types/article";
import { formatDate } from "@/lib/format";
import { recordView } from "@/api/article";
import { ArticleComments } from "@/components/article/ArticleComments";
import { MarkdownRenderer } from "@/components/article/MarkdownRenderer";

/* ───── Reading Progress ───── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 h-1 z-[60] w-full pointer-events-none">
      <div className="h-full bg-gradient-to-r from-accent via-accent2 to-accent transition-all duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

/* ───── TOC ───── */
function TOCSidebar() {
  const [activeId, setActiveId] = useState("");
  const [visible, setVisible] = useState(false);
  const headingsRef = useRef<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLHeadingElement>(".article-body h2, .article-body h3");
    headingsRef.current = Array.from(els).map((h, i) => {
      if (!h.id) h.id = `h-${i}`;
      return { id: h.id, text: h.textContent || "", level: h.tagName === "H2" ? 2 : 3 };
    });
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); } },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    els.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.8 : 600;
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (headingsRef.current.length === 0) return null;

  return (
    <aside className={`hidden xl:block fixed left-8 top-32 w-56 text-sm z-40 max-h-[60vh] overflow-y-auto transition-opacity duration-500 ${
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}>
      <style>{`.article-body h2, .article-body h3 { scroll-margin-top: 80px; }`}</style>
      <h4 className="font-serif font-bold text-xs text-text-muted mb-3 tracking-wider uppercase">目录</h4>
      <nav className="space-y-1.5">
        {headingsRef.current.map((h, i) => (
          <button key={i} onClick={() => {
            const el = document.getElementById(h.id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
            className={`block w-full text-left transition-colors duration-300 border-l-2 py-1 text-xs bg-transparent cursor-pointer ${
              activeId === h.id ? "border-accent text-accent" : "border-border text-text-muted/60 hover:text-text-body hover:border-text-muted"
            } ${h.level === 3 ? "pl-5" : "pl-3"}`}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </aside>
  );
}

/* ───── Article Content ───── */
export function ArticleContent({ article, coverUrl: coverUrlProp }: { article: Article; coverUrl?: string }) {
  // Record a page view once on mount
  useEffect(() => {
    if (article.id) recordView(article.id);
  }, [article.id]);

  // Force scroll to top when entering article (unless URL has hash)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.history?.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, []);

  const coverUrl = coverUrlProp || article.cover ||
    "https://bu.dusays.com/2023/11/10/654e2da1d80f8.jpg";

  return (
    <>
      <ReadingProgress />
      <TOCSidebar />

      <main className="flex-1">
        {/* ───── Full-screen Hero Cover ───── */}
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary), rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.2) 65%, var(--bg-primary) 100%)" }} />

          {/* Centered content on hero */}
          <div className="relative z-10 text-center max-w-4xl mx-auto backdrop-blur-sm bg-black/15 rounded-2xl py-10 px-8">
            {/* Categories */}
            <div className="flex justify-center gap-2 mb-6">
              {article.cateList?.map((c) => (
                <Link key={c.id} href={`/cate/${c.id}`}
                  className="text-xs rounded-full border border-accent/60 text-accent/90 px-4 py-1.5 font-sans backdrop-blur-sm bg-black/20 hover:bg-accent/20 transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 drop-shadow-2xl overflow-hidden line-clamp-2" style={{ textShadow: "var(--hero-text-shadow)" }}>
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex justify-center items-center gap-3 md:gap-8 text-xs md:text-base font-sans text-text-body/90 flex-wrap" style={{ textShadow: "var(--hero-text-shadow)" }}>
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                <span className="font-medium">{formatDate(article.createTime)}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-text-body/20" />
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                <span className="font-medium">{article.view ?? 0}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-text-body/20" />
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                <span className="font-medium">{article.comment ?? 0}</span>
              </span>
              {article.tagList?.slice(0, 3).map((t) => (
                <Link key={t.id} href={`/tag/${t.id}`}
                  className="text-xs border border-border/60 rounded px-2 py-1 backdrop-blur-sm bg-black/10 hover:border-accent2 hover:text-accent2 transition-colors">
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Scroll hint at bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-text-muted/60 font-sans tracking-widest">向下滚动</span>
            <div className="w-5 h-8 border-2 border-text-muted/40 rounded-full relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-accent rounded-full" />
            </div>
          </div>
        </section>

        {/* ───── Content below cover ───── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          <article>
            {/* Description */}
            {article.description && (
              <p className="text-base md:text-lg text-text-muted mb-12 leading-relaxed border-l-4 border-accent/30 pl-6 italic">
                {article.description}
              </p>
            )}

            {article.content ? (
              <MarkdownRenderer content={article.content} />
            ) : (
              <p className="font-kai text-text-muted text-center py-12">暂无内容</p>
            )}

            {/* Tags */}
            {article.tagList && article.tagList.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                {article.tagList.map((t) => (
                  <Link key={t.id} href={`/tag/${t.id}`}
                    className="px-4 py-1.5 text-sm rounded-full border border-border text-text-muted hover:border-accent2 hover:text-accent2 transition-all font-sans">
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Comments */}
            <ArticleComments articleId={article.id!} />

            {/* Prev / Next */}
            <nav className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {article.prev?.id ? (
                <Link href={`/article/${article.prev.id}`} className="group p-5 rounded-xl border border-border hover:border-accent/40 transition-all">
                  <span className="text-xs font-sans text-text-muted mb-2 block tracking-wider">上一篇</span>
                  <span className="font-serif text-sm text-text-body/70 group-hover:text-accent transition-colors line-clamp-2">{article.prev.title}</span>
                </Link>
              ) : <div />}
              {article.next?.id ? (
                <Link href={`/article/${article.next.id}`} className="group p-5 rounded-xl border border-border hover:border-accent/40 transition-all text-right">
                  <span className="text-xs font-sans text-text-muted mb-2 block tracking-wider">下一篇</span>
                  <span className="font-serif text-sm text-text-body/70 group-hover:text-accent transition-colors line-clamp-2">{article.next.title}</span>
                </Link>
              ) : <div />}
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
