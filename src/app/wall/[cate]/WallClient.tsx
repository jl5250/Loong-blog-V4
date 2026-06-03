"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getWallPaging, getWallCatePaging, addWallMessage } from "@/api/wall";
import { formatDate } from "@/lib/format";
import type { Wall as WallType, WallCate } from "@/types/wall";

interface WallClientProps {
  cateSlug: string;
  cateList: WallCate[];
  initialWalls: WallType[];
}

const PAGE_SIZE = 12;

export function WallClient({ cateSlug, cateList, initialWalls }: WallClientProps) {
  const params = useParams();
  const currentCate = (params?.cate as string) || cateSlug;

  const [walls, setWalls] = useState<WallType[]>(initialWalls);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const currentPageRef = useRef(1);

  // Reset when category changes
  useEffect(() => {
    setWalls(initialWalls);
    setPage(1);
    setHasMore(true);
    currentPageRef.current = 1;
  }, [currentCate, initialWalls]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = currentPageRef.current + 1;
      const cateId = cateList.find((c) => c.mark === currentCate)?.id;

      let res;
      if (currentCate === "all" || !cateId) {
        res = await getWallPaging(nextPage, PAGE_SIZE);
      } else {
        res = await getWallCatePaging(cateId, nextPage, PAGE_SIZE);
      }

      if (res.code === 200 && res.data) {
        const result = res.data.result ?? [];
        if (result.length > 0) {
          setWalls((prev) => [...prev, ...result]);
          setTotalPages(res.data.pages ?? 1);
          setHasMore(nextPage < (res.data.pages ?? 1));
          currentPageRef.current = nextPage;
          setPage(nextPage);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, currentCate, cateList]);

  return (
    <main className="flex-1">
      {/* ───── Hero Header ───── */}
      <div className="relative pt-28 pb-16 px-6 text-center overflow-hidden border-b border-border">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-8" style={{ background: "radial-gradient(circle, var(--accent-hex), transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-6" style={{ background: "radial-gradient(circle, var(--accent2-hex), transparent 70%)" }} />

        <div className="relative z-1">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-body/10 mb-4 block">言</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">留言墙</h1>
          <p className="font-kai text-text-muted text-sm mb-8">Message Wall · 宣纸笺条</p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-sans hover:opacity-90 transition-all"
          >
            {showForm ? "收起" : "✏️ 写留言"}
          </button>

          {showForm && (
            <div className="mt-6 max-w-md mx-auto">
              <WallForm onSuccess={() => setShowForm(false)} />
            </div>
          )}
        </div>
      </div>

      {/* ───── Category Seals ───── */}
      <div className="flex flex-wrap justify-center gap-4 px-6 py-8">
        {cateList.map((c) => (
          <Link
            key={c.id}
            href={`/wall/${c.mark}`}
            className="group relative flex flex-col items-center"
          >
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-lg font-calligraphy transition-all duration-300 ${
              currentCate === c.mark
                ? "border-accent2 bg-accent2/10 text-accent2 shadow-[0_0_20px_var(--glow2)]"
                : "border-border text-text-muted hover:border-accent2 hover:text-accent2"
            }`}>
              {c.name[0]}
            </div>
            <span className="text-[.6rem] mt-1.5 font-sans text-text-muted">{c.name}</span>
          </Link>
        ))}
      </div>

      {/* ───── Wall Grid ───── */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {walls.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {walls.map((w) => (
                <WallCard key={w.id} wall={w} />
              ))}
            </div>

            {/* Load more */}
            <div className="text-center py-10">
              {loading ? (
                <span className="font-sans text-sm text-text-muted animate-pulse">加载中...</span>
              ) : hasMore ? (
                <button onClick={loadMore}
                  className="px-6 py-2.5 rounded-full border border-border text-text-muted text-sm font-sans hover:border-accent hover:text-accent transition-all">
                  加载更多留言
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="font-calligraphy text-3xl text-text-muted/10">完</span>
                  <span className="font-sans text-xs text-text-muted/40">没有更多了</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <span className="font-calligraphy text-6xl text-text-muted/10">空</span>
            <p className="font-kai text-text-muted mt-4">此间无声，来做第一个留言的人吧</p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ───── Card ───── */
const CARD_COLORS = [
  { bg: "linear-gradient(135deg, rgba(255,71,87,0.08), transparent)", dot: "var(--accent-hex)" },
  { bg: "linear-gradient(135deg, rgba(0,210,211,0.08), transparent)", dot: "var(--accent2-hex)" },
  { bg: "linear-gradient(135deg, rgba(236,202,106,0.08), transparent)", dot: "var(--gold-hex)" },
  { bg: "linear-gradient(135deg, rgba(74,144,255,0.08), transparent)", dot: "var(--neon-blue-hex)" },
];

function WallCard({ wall }: { wall: WallType }) {
  const style = CARD_COLORS[Math.abs(wall.id) % CARD_COLORS.length];

  return (
    <div
      className="relative border border-border rounded-2xl p-6 bg-bg-surface transition-all duration-400 hover:-translate-y-1.5 hover:border-accent2/50 hover:shadow-[0_8px_30px_rgba(0,210,211,0.08)]"
      style={{ background: style.bg }}
    >
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: style.dot }} />

      <p className="font-kai text-sm leading-relaxed mb-5 break-words">
        {wall.content}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[.6rem] font-bold text-white flex-shrink-0"
          style={{ background: style.dot }}
        >
          {wall.name?.[0] ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-bold text-xs truncate">{wall.name}</div>
          <div className="font-sans text-[.55rem] text-text-muted">{formatDate(wall.createTime)}</div>
        </div>
        {wall.cate && (
          <span className="text-[.5rem] font-sans text-text-muted/50 border border-border/50 rounded-full px-2 py-0.5">
            {wall.cate.name}
          </span>
        )}
      </div>
    </div>
  );
}

/* ───── Form ───── */
function WallForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await addWallMessage({ name, content, email, cateId: 0, h_captcha_response: "" });
      setName(""); setContent(""); setEmail("");
      alert("留言成功！审核通过后可见。");
      onSuccess();
    } catch {}
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-6 rounded-2xl border border-border bg-bg-surface">
      <div className="grid md:grid-cols-2 gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="你的名字 *"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-primary text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
        />
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱（选填）"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-primary text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
        />
      </div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)}
        placeholder="写下你想说的话... *"
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-primary text-sm font-kai text-text-body outline-none focus:border-accent transition-colors resize-none"
      />
      <div className="flex gap-3">
        <button type="submit" disabled={submitting}
          className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-sans font-medium hover:opacity-90 transition-all disabled:opacity-50">
          {submitting ? "提交中..." : "发布留言"}
        </button>
        <button type="button" onClick={onSuccess}
          className="px-5 py-2.5 rounded-xl border border-border text-text-muted text-sm font-sans hover:border-accent hover:text-accent transition-all">
          取消
        </button>
      </div>
    </form>
  );
}
