import type { Metadata } from "next";
import { getCateList } from "@/api/cate";
import { getArticlePaging } from "@/api/article";
import Link from "next/link";
import { formatDate } from "@/lib/format";

interface Props {
  params: Promise<{ id: number }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const listRes = await getCateList();
    const cates = (listRes.data as any)?.result ?? [];
    const cate = cates.find((c: any) => c.id === Number(params.id));
    if (cate?.name) return { title: cate.name };
  } catch {}
  return { title: "分类" };
}

export default async function CatePage(props: Props) {
  const params = await props.params;
  const cateId = Number(params.id);

  const [listRes, articlesRes] = await Promise.allSettled([
    getCateList(),
    getArticlePaging(1, 20, "", cateId),
  ]);

  const cates = listRes.status === "fulfilled" ? ((listRes.value.data as any)?.result ?? []) : [];
  const cate = cates.find((c: any) => c.id === cateId);
  const articles = articlesRes.status === "fulfilled" ? (articlesRes.value.data?.result ?? []) : [];

  return (
    <main className="flex-1 pt-28 md:pt-32 pb-20 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">{cate?.name ?? "分类"}</h1>
      {cate?.mark && (
        <p className="font-kai text-text-muted mb-8 text-sm">{cate.mark.toUpperCase()}</p>
      )}
      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a: any) => (
            <Link key={a.id} href={`/article/${a.id}`}
              className="block p-4 md:p-6 rounded-2xl border border-border bg-bg-surface hover:border-accent/40 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-lg mb-1">{a.title}</h2>
                  {a.description && (
                    <p className="text-sm text-text-muted line-clamp-2">{a.description}</p>
                  )}
                </div>
                <span className="font-sans text-xs text-text-muted whitespace-nowrap mt-1">
                  {formatDate(a.createTime)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-kai text-text-muted">暂无文章</p>
        </div>
      )}
    </main>
  );
}
