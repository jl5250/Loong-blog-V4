"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { getArticlePaging } from "@/api/article";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types/article";

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

  return (
    <main className="flex-1 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">搜索</h1>
          <p className="font-kai text-text-muted text-sm">Search · 查找文章</p>
        </div>

        {/* Search input */}
        <div className="flex gap-3 mb-10">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="输入关键词搜索文章..."
            className="flex-1 px-5 py-3 rounded-xl border border-border bg-bg-surface text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
          />
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
            {results.length > 0 ? (
              <div className="space-y-4">
                <p className="font-sans text-xs text-text-muted mb-4">
                  找到 {results.length} 条结果
                </p>
                {results.map((a) => (
                  <Link key={a.id} href={`/article/${a.id}`}
                    className="block p-5 rounded-xl border border-border bg-bg-surface hover:border-accent/40 transition-all">
                    <h3 className="font-serif font-bold text-base mb-1">{a.title}</h3>
                    {a.description && (
                      <p className="text-sm text-text-muted line-clamp-2">{a.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-muted font-sans">
                      <span>{formatDate(a.createTime)}</span>
                      <span>{a.view ?? 0} 浏览</span>
                      {a.cateList?.[0] && (
                        <span className="text-accent2">{a.cateList[0].name}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-kai text-text-muted">未找到相关文章</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
