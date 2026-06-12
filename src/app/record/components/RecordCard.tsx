"use client";

import ImageList from "./ImageList";

interface RecordItem {
  id?: number;
  content: string;
  images: string | string[] | null;
  createTime: number;
}

interface RecordCardProps {
  record: RecordItem;
  isLast?: boolean;
}

const MONTH_ZH = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

function formatDay(ts: number | string | undefined): string {
  if (!ts) return "--";
  const d = new Date(Number(ts));
  return String(d.getDate()).padStart(2, "0");
}

function formatMonth(ts: number | string | undefined): string {
  if (!ts) return "--";
  const d = new Date(Number(ts));
  return MONTH_ZH[d.getMonth()] || "--";
}

function formatTime(ts: number | string | undefined): string {
  if (!ts) return "";
  const d = new Date(Number(ts));
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getRelativeTimeLabel(ts: number | string | undefined): string {
  if (!ts) return "";
  const now = new Date();
  const then = new Date(Number(ts));
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays}天前`;
  if (diffDays >= 7 && diffDays <= 13) return "一周前";
  if (diffDays >= 14 && diffDays <= 20) return "两周前";
  if (diffDays >= 21 && diffDays <= 27) return "三周前";
  if (diffDays >= 28 && diffDays < 60) return "一月前";
  if (diffDays >= 60 && diffDays < 90) return "两月前";
  if (diffDays >= 90 && diffDays < 180) return "三月前";
  if (diffDays >= 180 && diffDays < 365) return "半年前";
  if (diffDays >= 365 && diffDays < 730) return "一年前";
  if (diffDays >= 730 && diffDays < 1095) return "两年前";
  if (diffDays >= 1095) return `${Math.floor(diffDays / 365)}年前`;
  return "";
}

/** Parse images field — handles JSON array strings, actual arrays, and single URLs */
function parseRecordImages(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  const trimmed = images.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch { /* fall through */ }
  }
  return [trimmed];
}

/** Detect if content contains HTML tags */
function isHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export default function RecordCard({ record, isLast }: RecordCardProps) {
  const { content, images, createTime } = record;

  return (
    <article className="relative flex gap-5 pb-12 group">
      {/* Left: timeline date decoration */}
      <div className="flex flex-col items-center flex-shrink-0 w-14 pt-1">
        <div className="text-[.55rem] font-sans text-text-muted tracking-widest">
          {formatMonth(createTime)}
        </div>
        <div className="text-xl font-black text-text-body font-serif">
          {formatDay(createTime)}
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div className="h-full w-px bg-border my-2" />
        )}
      </div>

      {/* Right: content card */}
      <div className="flex-grow min-w-0">
        <div className="border border-border rounded-2xl p-5 bg-bg-surface hover:border-accent/30 transition-all duration-300">
          {/* Header: time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-white text-xs font-bold">
                宇
              </div>
              <div>
                <h3 className="font-bold text-text-body text-xs">宇阳</h3>
                <div className="text-[.6rem] text-text-muted font-sans">
                  {formatTime(createTime)}
                </div>
              </div>
            </div>
            <span className="text-[.6rem] text-text-muted/50 font-sans">
              {getRelativeTimeLabel(createTime)}
            </span>
          </div>

          {/* Content */}
          {content && (
            <div className="font-kai text-sm text-text-body leading-relaxed break-words mb-3">
              {isHTML(content) ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p>{content}</p>
              )}
            </div>
          )}

          {/* Images */}
          <div className="mt-3">
            <ImageList list={parseRecordImages(images)} />
          </div>
        </div>
      </div>
    </article>
  );
}
