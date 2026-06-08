/**
 * 文章封面图工具
 * 从主题 covers 数组或文章自带 cover 中选取图片
 */

export interface CoverResult {
  src: string;
  alt: string;
  isGradient: boolean;
}

export function getArticleCover(
  cover: string | undefined | null,
  id: number | undefined,
  title: string | undefined,
  themeCovers: string[]
): CoverResult {
  if (cover) return { src: cover, alt: title || "文章封面", isGradient: false };
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
 * 文章封面图组件（带 lazy loading 和渐变 fallback）
 */
export function ArticleCoverImage({
  cover,
  className = "",
}: {
  cover: CoverResult;
  className?: string;
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
    <img
      src={cover.src}
      alt={cover.alt}
      loading="lazy"
      decoding="async"
      className={`${className} object-cover transition-opacity duration-300`}
    />
  );
}
