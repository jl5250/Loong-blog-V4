import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleData } from "@/api/article";
import { ArticleContent } from "./ArticleContent";

interface Props {
  params: Promise<{ id: number }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const res = await getArticleData(params.id);
    const article = res.data;
    if (!article?.title) return { title: "文章" };
    return {
      title: article.title,
      description: article.description,
      alternates: {
        canonical: `https://loongblog.fun/article/${params.id}`,
      },
      openGraph: {
        title: article.title,
        description: article.description,
        images: article.cover ? [{ url: article.cover }] : [],
      },
    };
  } catch {
    return { title: "文章" };
  }
}

export default async function ArticlePage(props: Props) {
  const params = await props.params;
  const res = await getArticleData(params.id);
  const article = res.data;

  if (!article?.id) notFound();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: article.cover || undefined,
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
      <ArticleContent article={article} />
    </>
  );
}
