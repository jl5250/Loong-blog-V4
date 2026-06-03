"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import RecordCard from "./components/RecordCard";
import { getRecordPaging } from "@/api/record";
import type { Record } from "@/types/record";

const PAGE_SIZE = 8;

export default function RecordPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const currentPageRef = useRef(1);

  const fetchRecords = useCallback(async (page: number, append = false) => {
    setLoading(true);
    try {
      const res = await getRecordPaging(page, PAGE_SIZE);
      if (res.code === 200 && res.data) {
        const data = res.data;
        const list = data.result ?? [];
        if (list.length > 0) {
          setRecords((prev) => (append ? [...prev, ...list] : list));
          setHasMore(page < (data.pages ?? 1));
          currentPageRef.current = page;
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRecords(1);
  }, [fetchRecords]);

  // Infinite scroll with debounce
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 150) {
        const nextPage = currentPageRef.current + 1;
        fetchRecords(nextPage, true);
      }
    };

    let timeout: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 200);
    };

    window.addEventListener("scroll", debounced, { passive: true });
    return () => {
      window.removeEventListener("scroll", debounced);
      clearTimeout(timeout);
    };
  }, [loading, hasMore, fetchRecords]);

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-accent2/4 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-accent/3 blur-[80px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">说</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">说说</h1>
          <p className="font-kai text-text-muted">
            Moments · 墨点时间轴
            {records.length > 0 && (
              <span className="ml-2 text-xs text-text-muted/40">
                ({records.length})
              </span>
            )}
          </p>
        </div>

        {/* Timeline */}
        {initialLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="font-kai text-xs text-text-muted">加载中...</span>
            </div>
          </div>
        ) : records.length > 0 ? (
          <div className="relative pl-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[1.6875rem] top-0 bottom-0 w-px bg-border" />

            {records.map((r, i) => (
              <RecordCard
                key={r.id ?? i}
                record={r}
                isLast={i === records.length - 1 && !hasMore}
              />
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-text-muted text-xs font-kai">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  加载中...
                </div>
              </div>
            )}

            {/* End marker */}
            {!hasMore && records.length > 0 && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-text-muted/30 text-xs font-kai">
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="font-kai text-text-muted">此间无声</p>
          </div>
        )}
      </div>
    </main>
  );
}
