import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleData } from "@/api/article";
import { getThemeConfig } from "@/api/config";
import { getArticleCover, extractCovers } from "@/lib/article-cover";
import { ArticleContent } from "./ArticleContent";

interface Props {
  params: Promise<{ id: number }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const [res, themeRes] = await Promise.all([
      getArticleData(params.id),
      getThemeConfig(),
    ]);
    const article = res.data;
    if (!article?.title) return { title: "文章" };
    const themeCovers = extractCovers(themeRes.data?.value);
    const cover = getArticleCover(article.cover, article.id, article.title, themeCovers);
    return {
      title: article.title,
      description: article.description,
      alternates: {
        canonical: `https://loongblog.fun/article/${params.id}`,
      },
      openGraph: {
        title: article.title,
        description: article.description,
        images: cover.src ? [{ url: cover.src }] : [{ url: "/og-default.png" }],
      },
    };
  } catch {
    return { title: "文章" };
  }
}

export default async function ArticlePage(props: Props) {
  const params = await props.params;
  const [res, themeRes] = await Promise.all([
    getArticleData(params.id),
    getThemeConfig(),
  ]);
  const article = res.data;

  if (!article?.id) notFound();

  // Resolve cover using same logic as homepage
  const themeCovers = extractCovers(themeRes.data?.value);
  const cover = getArticleCover(article.cover, article.id, article.title, themeCovers);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: cover.src || undefined,
    url: `https://loongblog.fun/article/${article.id}`,
    author: {
      "@type": "Person",
      name: "Loong",
    },
    publisher: {
      "@type": "Organization",
      name: "Loong·Blog",
      url: "https://loongblog.fun",
    },
    datePublished: article.createTime,
    dateModified: article.createTime,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleContent article={article} coverUrl={cover.src} />
    </>
  );
}
