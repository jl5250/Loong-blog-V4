"use client";

import { useEffect, useState } from "react";
import { getArticleComments } from "@/api/comment";
import { formatDate } from "@/lib/format";
import type { Comment } from "@/types/comment";

export function ArticleComments({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticleComments(articleId).then((res) => {
      setComments(res.data?.result ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [articleId]);

  if (loading) {
    return (
      <div id="comments" className="mt-12 pt-8 border-t border-border">
        <h3 className="font-serif font-bold text-lg mb-6">评论</h3>
        <p className="font-sans text-sm text-text-muted animate-pulse">加载中...</p>
      </div>
    );
  }

  return (
    <div id="comments" className="mt-12 pt-8 border-t border-border scroll-mt-24">
      <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-3">
        <span className="w-1 h-5 bg-accent rounded" />
        评论 ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 p-4 rounded-xl border border-border bg-bg-surface hover:border-accent/30 transition-colors">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-accent/30 to-accent2/30">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-text-muted">
                    {c.name?.[0] ?? "?"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif font-bold text-sm">{c.name}</span>
                  <span className="font-sans text-[.6rem] text-text-muted">{formatDate(c.createTime)}</span>
                </div>
                <p className="font-kai text-sm leading-relaxed text-text-body/90">{c.content}</p>
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer"
                    className="font-sans text-[.6rem] text-accent2 hover:underline mt-1 inline-block">
                    {c.url}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <p className="font-kai text-text-muted text-sm">暂无评论</p>
        </div>
      )}

      {/* Comment form placeholder */}
      <div className="mt-6 p-4 rounded-xl border border-dashed border-border/60">
        <p className="font-sans text-xs text-text-muted/50 text-center">
          评论功能待接入
        </p>
      </div>
    </div>
  );
}
