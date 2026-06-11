"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { getArticlePaging } from "@/api/article";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types/article";

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-accent/20 text-accent rounded-sm px-0.5">{part}</mark>
    ) : (
      part
    )
  );
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await getArticlePaging(1, 20, query.trim());
      setResults(res.data?.result ?? []);
    } catch {}
    setLoading(false);
  }, [query]);

  // Focus search on "/" keypress
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">搜</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">搜索</h1>
          <p className="font-kai text-text-muted text-sm">Search · 查找文章 · 按 / 快速聚焦</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="输入关键词搜索文章..."
              className="w-full pl-10 pr-5 py-3 rounded-xl border border-border bg-bg-surface text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-sans hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "搜索中..." : "搜索"}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-5 rounded-xl border border-border bg-bg-surface animate-pulse">
                    <div className="h-5 bg-border/40 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-border/30 rounded w-full mb-2" />
                    <div className="h-4 bg-border/30 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <p className="font-sans text-xs text-text-muted mb-4">
                  找到 <span className="text-accent">{results.length}</span> 条结果
                </p>
                {results.map((a) => (
                  <Link key={a.id} href={`/article/${a.id}`}
                    className="block p-5 rounded-xl border border-border bg-bg-surface hover:border-accent/40 hover:-translate-y-0.5 transition-all">
                    <h3 className="font-serif font-bold text-base mb-1">
                      {a.title ? highlight(a.title, query) : "无标题"}
                    </h3>
                    {a.description ? (
                      <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                        {highlight(a.description, query)}
                      </p>
                    ) : a.content ? (
                      <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                        {highlight(a.content.replace(/<[^>]+>/g, "").slice(0, 200), query)}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-muted font-sans flex-wrap">
                      <span>{formatDate(a.createTime)}</span>
                      <span>{a.view ?? 0} 浏览</span>
                      {a.cateList?.[0] && (
                        <span className="text-accent2">{a.cateList[0].name}</span>
                      )}
                      {a.tagList?.slice(0, 2).map((t) => (
                        <Link key={t.id} href={`/tag/${t.id}`}
                          className="border border-border/50 rounded px-2 py-0.5 text-[.6rem] hover:border-accent2 hover:text-accent2 transition-colors">
                          #{t.name}
                        </Link>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="font-calligraphy text-5xl text-text-muted/10 mb-4 block">空</span>
                <p className="font-kai text-text-muted mb-2">未找到相关文章</p>
                <p className="font-sans text-xs text-text-muted/50">
                  试试其他关键词，如 &quot;ThriveX&quot;、&quot;Markdown&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial state */}
        {!searched && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <svg className="mx-auto mb-4 text-text-muted/10" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p className="font-kai text-text-muted text-sm">输入关键词开始搜索</p>
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              {["ThriveX", "Markdown", "Hello World"].map((tag) => (
                <button key={tag} onClick={() => { setQuery(tag); setTimeout(() => handleSearch(), 0); }}
                  className="px-4 py-1.5 text-xs rounded-full border border-border text-text-muted hover:border-accent hover:text-accent transition-all bg-transparent cursor-pointer">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
