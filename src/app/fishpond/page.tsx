"use client";

import { useState, useEffect } from "react";
import { getRssList, type RssItem } from "@/api/rss";

function formatDate(ts: string): string {
  const d = new Date(Number(ts));
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function getAuthorName(item: RssItem): string {
  return item.email ? item.email.split("@")[0] : "匿名";
}

export default function FishpondPage() {
  const [rssData, setRssData] = useState<RssItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRssList()
      .then((res) => {
        if (res.code === 200) {
          const list = (res.data as { result?: RssItem[] })?.result ?? (Array.isArray(res.data) ? res.data as RssItem[] : []);
          setRssData(list);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="font-kai text-xs text-text-muted">潜入信息的海洋...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent/3 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-accent2/4 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-accent/3 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">鱼</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">鱼塘</h1>
          <p className="font-kai text-text-muted">Fishpond · 潜入信息的海洋，捕获最新鲜的动态</p>
        </div>

        {rssData && rssData.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-5 space-y-3 md:space-y-5">
            {rssData.map((item, index) => (
              <article
                key={`${item.url}-${index}`}
                className="break-inside-avoid border border-border rounded-2xl p-5 bg-bg-surface hover:border-accent/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top gradient line */}
                <div className="h-[2px] rounded-full bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 mb-4" />

                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-bg-card flex-shrink-0 border border-border">
                    {item.image ? (
                      <img src={item.image} alt={getAuthorName(item)} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[.6rem] font-bold text-text-muted">
                        {getAuthorName(item)[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-text-body">
                      {getAuthorName(item)}
                    </div>
                    <div className="font-sans text-[.55rem] text-text-muted">
                      {formatDate(item.createTime)}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-sm mb-2 line-clamp-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-body hover:text-accent transition-colors no-underline"
                  >
                    {item.title}
                  </a>
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="font-kai text-xs text-text-muted leading-relaxed line-clamp-4 mb-4">
                    {item.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                  <span className="font-sans text-[.55rem] text-accent2/70 border border-border/50 rounded-full px-2.5 py-0.5">
                    #{item.type || "未分类"}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[.55rem] text-text-muted/50 hover:text-accent transition-colors"
                  >
                    阅读 ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <span className="font-calligraphy text-6xl text-text-muted/10">空</span>
            <p className="font-kai text-text-muted mt-4">鱼塘里暂时没有鱼儿游过~</p>
          </div>
        )}
      </div>
    </main>
  );
}
