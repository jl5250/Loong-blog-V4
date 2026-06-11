"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getArticlePaging } from "@/api/article";
import { getThemeConfig } from "@/api/config";
import { getArticleCover, extractCovers, ArticleCoverImage } from "@/lib/article-cover";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types/article";

export default function LatestArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [covers, setCovers] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch theme covers once
  useEffect(() => {
    getThemeConfig().then((res) => {
      setCovers(extractCovers(res.data?.value));
    }).catch(() => {});
  }, []);

  // Fetch articles on page change
  useEffect(() => {
    setLoading(true);
    getArticlePaging(page, 4).then((res) => {
      const data = res.data;
      setArticles((data?.result ?? []).slice(0, 4));
      setTotalPages(data?.totalPage ?? 1);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [page]);

  // Animate on page change
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const xFrom = direction === "left" ? 60 : -60;
    el.style.transition = "none";
    el.style.transform = `translateX(${xFrom}px)`;
    el.style.opacity = "0";
    // Force reflow
    el.offsetHeight;
    el.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
  }, [page, direction]);

  const goPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    setDirection(p > page ? "left" : "right");
    setPage(p);
  };

  return (
    <section className="sn" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="sn-inner">
        <div className="sn-hdr">
          <h2><span className="text-gold">最新文章</span><span className="en">LATEST</span></h2>
          <hr />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border rounded-2xl overflow-hidden bg-bg-card">
                <div className="h-[200px] bg-gradient-to-br from-bg-surface-raised to-bg-surface animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-bg-surface-raised rounded animate-pulse" />
                  <div className="h-3 w-full bg-bg-surface-raised rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((a) => {
              const cover = getArticleCover(a.cover, a.id, a.title, covers);
              return (
                <Link key={a.id} href={`/article/${a.id}`}
                  className="border border-border rounded-2xl overflow-hidden bg-bg-card transition-all duration-400 hover:-translate-y-1 hover:border-accent2 hover:shadow-[0_12px_40px_var(--glow-soft)] relative flex flex-col group">
                  <div className="h-[200px] flex-shrink-0 relative overflow-hidden bg-cover bg-center">
                    <ArticleCoverImage cover={cover} className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent opacity-70" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card), transparent 50%)" }} />
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full text-[.6rem] border border-accent2 text-accent2 bg-black/50 backdrop-blur-sm">
                      {a.cateList?.[0]?.name || "文章"}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif font-bold text-base mb-1.5 leading-tight">{a.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed flex-1 line-clamp-2 mb-0">{a.description}</p>
                    <div className="flex items-center gap-2.5 text-[.65rem] text-text-muted mt-auto pt-2.5 border-t border-border">
                      <span>{formatDate(a.createTime)}</span>
                      <span>{a.config?.top ? "置顶" : `${a.view ?? 0} 浏览`}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-16 border border-dashed border-border rounded-2xl">
              <p className="font-kai text-text-muted">暂无文章</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 text-sm font-sans rounded-xl border border-border text-text-muted hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-transparent cursor-pointer"
            >
              ← 上一页
            </button>
            <span className="font-sans text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm font-sans rounded-xl border border-border text-text-muted hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-transparent cursor-pointer"
            >
              下一页 →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
