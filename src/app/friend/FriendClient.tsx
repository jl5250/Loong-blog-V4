"use client";

import { useState } from "react";
import Link from "next/link";

interface WebInfo {
  title?: string;
  description?: string;
  url?: string;
  subhead?: string;
  favicon?: string;
  icp?: string;
}

interface LinkItem {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  rss: string;
  type: { name: string };
}

interface AuthorInfo {
  name?: string;
  avatar?: string;
  info?: string;
}

interface FriendClientProps {
  grouped: [string, { order: number; list: LinkItem[] }][];
  webInfo: WebInfo | null;
  author: AuthorInfo | null;
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%232a3a5c' cx='32' cy='32' r='32'/%3E%3Cpath fill='%238e8a80' d='M32 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0 8c-8 0-16 4-16 12v4h32v-4c0-8-8-12-16-12z'/%3E%3C/svg%3E";

export function FriendClient({ grouped, webInfo, author }: FriendClientProps) {
  return (
    <main className="flex-1 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* ─── Hero: my info ─── */}
        {webInfo && (
          <section className="mb-16">
            <div className="relative border border-border rounded-2xl overflow-hidden bg-bg-surface p-8 md:p-10">
              {/* Decoration */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-5" style={{ background: "radial-gradient(circle, var(--accent-hex), transparent 70%)" }} />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-5" style={{ background: "radial-gradient(circle, var(--accent2-hex), transparent 70%)" }} />

              <div className="relative z-1 flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden bg-bg-surface-raised">
                    <img src={author?.avatar || webInfo?.favicon || DEFAULT_AVATAR} alt={author?.name || webInfo?.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-serif font-bold text-2xl mb-1">{author?.name || webInfo?.title || "ThriveX"}</h2>
                  <p className="font-kai text-text-muted text-sm mb-4">{author?.info || webInfo?.description || webInfo?.subhead || ""}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <CopyField label="网站地址" value={webInfo.url || ""} />
                    <CopyField label="RSS" value={webInfo.url ? `${webInfo.url}/api/rss` : ""} />
                    <CopyField label="头像地址" value={author?.avatar || webInfo?.favicon || ""} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Header ─── */}
        <div className="text-center mb-14">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">朋</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">友链</h1>
          <p className="font-kai text-text-muted">Friend Links · 以文会友</p>
        </div>

        {/* ─── Grouped links ─── */}
        {grouped.length > 0 ? (
          <div className="space-y-14">
            {grouped.map(([typeName, group]) => (
              <section key={typeName}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-serif font-bold text-xl whitespace-nowrap">{typeName}</h2>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, var(--border), transparent)" }} />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {group.list.map((item) => (
                    <Link key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-bg-surface transition-all duration-400 hover:-translate-y-1.5 hover:border-accent2/50 hover:shadow-[0_8px_30px_rgba(0,210,211,0.08)]"
                    >
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border group-hover:border-accent2/50 transition-colors">
                          <img src={item.image || DEFAULT_AVATAR} alt={item.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }} />
                        </div>
                        <div className="absolute -inset-1.5 rounded-full border border-dashed border-border/40 group-hover:border-accent2/30 transition-all duration-500" />
                      </div>
                      <h3 className="font-serif font-bold text-sm mb-1.5 truncate w-full group-hover:text-accent2 transition-colors">{item.title}</h3>
                      <p className="font-sans text-xs text-text-muted line-clamp-2 leading-relaxed">{item.description || "暂无介绍"}</p>
                      {item.rss && <span className="mt-3 text-[.5rem] font-sans text-text-muted/40 border border-border/50 rounded-full px-2 py-0.5">RSS</span>}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="font-calligraphy text-6xl text-text-muted/10">空</span>
            <p className="font-kai text-text-muted mt-4">暂无友链</p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── Copy field ─── */
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-sans transition-all ${
        copied ? "border-accent2 text-accent2" : "border-border text-text-muted hover:border-accent hover:text-accent"
      }`}
    >
      <span className="opacity-60">{label}:</span>
      <span className="max-w-[160px] truncate">{value || "—"}</span>
      <span className="text-[.55rem] opacity-40 group-hover:opacity-100">{copied ? "✓" : "复制"}</span>
    </button>
  );
}
