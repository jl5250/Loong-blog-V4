"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import type { Components } from "react-markdown";

const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".avi", ".mkv"];

function isVideoUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  return VIDEO_EXTS.some((ext) => url.toLowerCase().includes(ext));
}

function getYoutubeId(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const m = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getBilibiliId(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const m = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const html = useMemo(() => {
    try {
      if (language && hljs.getLanguage(language)) return hljs.highlight(value, { language }).value;
      return hljs.highlightAuto(value).value;
    } catch { return value; }
  }, [value, language]);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border/60 bg-[#0d1117]">
      {language && (
        <div className="flex items-center justify-between px-5 py-2 text-xs font-mono text-text-muted/60 border-b border-border/20 bg-[#161b22]">
          <span>{language}</span>
          <button onClick={() => navigator.clipboard.writeText(value)} className="hover:text-accent transition-colors">复制</button>
        </div>
      )}
      <pre className="p-5 overflow-x-auto"><code className="font-mono text-sm leading-relaxed text-[#e6e1cf]" dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  );
}

const components: Partial<Components> = {
  h2: ({ children, ...p }) => {
    const id = String(children).replace(/\s+/g, "-").toLowerCase();
    return <h2 id={id} className="font-serif font-bold text-2xl mt-10 mb-4 pb-2 border-b border-border" {...p}>{children}</h2>;
  },
  h3: ({ children, ...p }) => {
    const id = String(children).replace(/\s+/g, "-").toLowerCase();
    return <h3 id={id} className="font-serif font-bold text-xl mt-8 mb-3" {...p}>{children}</h3>;
  },
  p: ({ children, ...p }) => <p className="mb-4 leading-[1.9] text-justify text-base md:text-lg" {...p}>{children}</p>,

  a: ({ children, href, ...p }) => {
    const h = typeof href === "string" ? href : undefined;
    if (h && isVideoUrl(h)) return <div className="my-6 rounded-xl overflow-hidden border border-border"><video controls className="w-full max-h-[500px]" preload="metadata"><source src={h} /></video></div>;
    if (h && getYoutubeId(h)) return <div className="my-6 aspect-video rounded-xl overflow-hidden border border-border"><iframe src={`https://www.youtube.com/embed/${getYoutubeId(h)}`} className="w-full h-full" allowFullScreen title="YouTube" /></div>;
    if (h && getBilibiliId(h)) return <div className="my-6 aspect-video rounded-xl overflow-hidden border border-border"><iframe src={`https://player.bilibili.com/player.html?bvid=${getBilibiliId(h)}`} className="w-full h-full" allowFullScreen title="Bilibili" /></div>;
    return <a href={h} target="_blank" rel="noopener noreferrer" className="text-accent2 underline underline-offset-2 hover:text-accent transition-colors" {...p}>{children}</a>;
  },

  blockquote: ({ children, ...p }) => <blockquote className="border-l-3 border-accent pl-5 py-2 my-6 text-text-muted italic bg-ink-texture rounded-r-lg" {...p}>{children}</blockquote>,

  code: ({ children, className, ...p }) => {
    const m = /language-(\w+)/.exec(className || "");
    if (!m) return <code className="px-1.5 py-0.5 rounded bg-bg-card text-accent text-sm font-mono" {...p}>{children}</code>;
    return <CodeBlock language={m[1]} value={String(children).replace(/\n$/, "")} />;
  },
  pre: ({ children }) => <>{children}</>,

  ul: ({ children, ...p }) => <ul className="list-disc pl-6 mb-4 space-y-1.5" {...p}>{children}</ul>,
  ol: ({ children, ...p }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5" {...p}>{children}</ol>,
  li: ({ children, ...p }) => <li className="text-base md:text-lg leading-relaxed" {...p}>{children}</li>,

  img: ({ src, alt, ...p }) => {
    const s = typeof src === "string" ? src : undefined;
    if (s && isVideoUrl(s)) return <div className="my-6 rounded-xl overflow-hidden border border-border"><video controls className="w-full max-h-[500px]" preload="metadata"><source src={s} /></video></div>;
    return s ? <a href={s} target="_blank" rel="noopener noreferrer"><img src={s} alt={alt || ""} className="rounded-xl my-6 max-w-full h-auto mx-auto cursor-zoom-in hover:opacity-90 transition-opacity" loading="lazy" {...p} /></a> : null;
  },

  hr: () => <hr className="my-8 border-border" />,
  table: ({ children, ...p }) => <div className="overflow-x-auto my-6"><table className="w-full border-collapse border border-border text-sm" {...p}>{children}</table></div>,
  th: ({ children, ...p }) => <th className="border border-border px-3 py-2 bg-bg-card font-bold text-left" {...p}>{children}</th>,
  td: ({ children, ...p }) => <td className="border border-border px-3 py-2" {...p}>{children}</td>,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="article-body">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
