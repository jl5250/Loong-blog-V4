/**
 * 文章封面图工具
 * 从主题 covers 数组或文章自带 cover 中选取图片
 */

import Image from "next/image";

export interface CoverResult {
  src: string;
  alt: string;
  isGradient: boolean;
}

export function normalizeCoverUrl(raw: string): string {
  if (!raw) return "";
  // Backend may store cover as a JSON array string, e.g. '["https://..."]'
  if (raw.startsWith("[")) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) return arr[0];
    } catch { /* fall through */ }
  }
  return raw;
}

export function getArticleCover(
  cover: string | undefined | null,
  id: number | undefined,
  title: string | undefined,
  themeCovers: string[]
): CoverResult {
  const url = normalizeCoverUrl(cover ?? "");
  if (url) return { src: url, alt: title || "文章封面", isGradient: false };
  if (themeCovers.length > 0 && id) {
    return {
      src: themeCovers[Math.abs(id) % themeCovers.length],
      alt: title || "文章封面",
      isGradient: false,
    };
  }
  return { src: "", alt: title || "文章封面", isGradient: true };
}

/**
 * 从 ThemeConfig 提取 covers 数组
 */
export function extractCovers(themeValue: unknown): string[] {
  const c = (themeValue as { covers?: string | string[] } | null)?.covers;
  if (!c) return [];
  if (Array.isArray(c)) return c;
  try { return JSON.parse(c); } catch { return []; }
}

/**
 * 文章封面图组件（使用 next/image 自动优化 WebP/AVIF）
 */
export function ArticleCoverImage({
  cover,
  className = "",
  width = 380,
  height = 214,
}: {
  cover: CoverResult;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (cover.isGradient) {
    return (
      <div
        className={className}
        style={{ background: "linear-gradient(135deg, var(--bg-surface-raised-hex), var(--bg-surface-hex))" }}
      />
    );
  }
  return (
    <Image
      src={cover.src}
      alt={cover.alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`${className} object-cover transition-opacity duration-300`}
      sizes="(max-width: 768px) 85vw, 380px"
    />
  );
}
