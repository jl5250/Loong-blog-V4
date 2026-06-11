"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getArticleComments, addComment } from "@/api/comment";
import { formatDate } from "@/lib/format";
import type { Comment } from "@/types/comment";

export function ArticleComments({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [apiError, setApiError] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getArticleComments(articleId);
      if (res.code === 200 && res.data) {
        setComments(res.data.result ?? []);
        setApiError(false);
      } else if (res.code === 500) {
        setApiError(true);
      }
    } catch (e) {
      console.error("Fetch comments failed:", e);
      setApiError(true);
    }
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Restore saved user info after form mounts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("comment_user");
      if (saved) {
        const { name, email, url } = JSON.parse(saved);
        if (name && nameRef.current) nameRef.current.value = name;
        if (email && emailRef.current) emailRef.current.value = email;
        if (url && urlRef.current) urlRef.current.value = url;
      }
    } catch {}
  }, [formKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const email = (formData.get("email") as string)?.trim() || "";
    const url = (formData.get("url") as string)?.trim() || "";

    if (!name || !content) return;

    let avatar = "";
    const qqMatch = email.match(/^(\d+)@qq\.com$/);
    if (qqMatch) {
      avatar = `https://q1.qlogo.cn/g?b=qq&nk=${qqMatch[1]}&s=640`;
    }

    setSubmitting(true);
    try {
      const res = await addComment({
        articleId,
        content,
        name,
        email,
        url,
        avatar,
        commentId: 0,
        createTime: Date.now().toString(),
        h_captcha_response: null,
      });
      if (res.code === 200) {
        // Persist user info
        try { localStorage.setItem("comment_user", JSON.stringify({ name, email, url })); } catch {}
        // Remount form (clear all fields)
        setFormKey((k) => k + 1);
        // Show feedback
        setFeedback("🎉 提交成功，请等待审核通过后展示");
        setTimeout(() => setFeedback(null), 4000);
      } else {
        alert("评论失败：" + (res.message || "未知错误"));
      }
    } catch (err) {
      console.error("Comment submit error:", err);
      alert("评论失败，请检查网络");
    }
    setSubmitting(false);
  };

  // Build comment tree
  const topComments = comments.filter((c) => !c.commentId || c.commentId === 0);
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.commentId === parentId);

  return (
    <div id="comments" className="mt-12 pt-8 border-t border-border scroll-mt-24">
      <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-3">
        <span className="w-1 h-5 bg-accent rounded" />
        评论 ({comments.length})
      </h3>

      {/* Comment form — key remounts it after success */}
      <form
        key={formKey}
        onSubmit={handleSubmit}
        className="mb-8 p-5 rounded-2xl border border-border bg-bg-surface"
      >
        <textarea
          name="content"
          required
          rows={3}
          placeholder="来发一针见血的评论吧~"
          className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-sm font-kai text-text-body outline-none focus:border-accent transition-colors resize-none mb-3"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            ref={nameRef}
            name="name"
            required
            placeholder="你的名称 *"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-primary text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
          />
          <input
            ref={emailRef}
            name="email"
            type="email"
            placeholder="邮箱（选填，QQ邮箱自动获取头像）"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-primary text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
          />
          <input
            ref={urlRef}
            name="url"
            placeholder="站点（选填）"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-primary text-sm font-sans text-text-body outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-sans font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {submitting ? "提交中..." : "发表评论"}
          </button>
        </div>
      </form>

      {/* Feedback message */}
      {feedback && (
        <div className="mb-4 px-5 py-3 rounded-xl bg-accent/10 border border-accent/30 text-sm font-kai text-accent text-center animate-pulse">
          {feedback}
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-bg-surface p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-bg-surface-raised" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-bg-surface-raised rounded" />
                  <div className="h-3 w-full bg-bg-surface-raised rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : apiError ? (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <p className="font-kai text-text-muted text-sm">评论服务暂时不可用，请稍后再试</p>
          <button onClick={fetchComments} className="mt-3 text-xs text-accent hover:text-accent2 transition-colors font-sans">
            重新加载
          </button>
        </div>
      ) : topComments.length > 0 ? (
        <div className="space-y-4">
          {topComments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={getReplies(c.id!)}
              articleId={articleId}
              onReplied={() => fetchComments()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <p className="font-kai text-text-muted text-sm">暂无评论，来第一条吧</p>
        </div>
      )}
    </div>
  );
}

/* ───── Single comment item ───── */
function CommentItem({
  comment,
  replies,
  articleId,
  onReplied,
}: {
  comment: Comment;
  replies: Comment[];
  articleId: number;
  onReplied: () => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      let name = "匿名";
      let email = "";
      let url = "";
      try {
        const saved = localStorage.getItem("comment_user");
        if (saved) {
          const u = JSON.parse(saved);
          if (u.name) name = u.name;
          if (u.email) email = u.email;
          if (u.url) url = u.url;
        }
      } catch {}

      let avatar = "";
      const qqMatch = email.match(/^(\d+)@qq\.com$/);
      if (qqMatch) {
        avatar = `https://q1.qlogo.cn/g?b=qq&nk=${qqMatch[1]}&s=640`;
      }

      const res = await addComment({
        articleId,
        content: replyContent,
        name,
        email,
        url,
        avatar,
        commentId: comment.id ?? 0,
        createTime: Date.now().toString(),
        h_captcha_response: null,
      });
      if (res.code === 200) {
        setReplyContent("");
        setShowReply(false);
        // Show feedback
        alert("🎉 回复成功，请等待审核通过后展示");
      } else {
        alert("回复失败：" + (res.message || "未知错误"));
      }
    } catch (err) {
      console.error("Reply error:", err);
      alert("回复失败");
    }
    setSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-accent/30 to-accent2/30">
            {comment.avatar ? (
              <img src={comment.avatar} alt={`${comment.name} 的头像`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-text-muted">
                {comment.name?.[0] ?? "?"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif font-bold text-sm">{comment.name}</span>
              <span className="font-sans text-[.6rem] text-text-muted">
                {formatDate(comment.createTime)}
              </span>
            </div>
            <p className="font-kai text-sm leading-relaxed text-text-body/90">
              {comment.content}
            </p>
            <button
              onClick={() => setShowReply(!showReply)}
              className="font-sans text-[.6rem] text-text-muted/50 hover:text-accent transition-colors mt-2 bg-transparent border-none cursor-pointer"
            >
              {showReply ? "取消回复" : "回复"}
            </button>
          </div>
        </div>
      </div>

      {showReply && (
        <div className="px-4 pb-4 pl-14">
          <div className="flex gap-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`回复 ${comment.name}...`}
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg-primary text-sm font-kai text-text-body outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleReply}
              disabled={submitting || !replyContent.trim()}
              className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-sans hover:opacity-90 transition-all disabled:opacity-50 flex-shrink-0"
            >
              {submitting ? "..." : "发送"}
            </button>
          </div>
        </div>
      )}

      {replies.length > 0 && (
        <div className="border-t border-border/50 bg-bg-card/50">
          {replies.map((reply) => (
            <div key={reply.id} className="p-4 pl-14 border-b border-border/30 last:border-0">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-accent2/30 to-accent/30">
                  {reply.avatar ? (
                    <img src={reply.avatar} alt={`${reply.name} 的头像`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[.6rem] font-bold text-text-muted">
                      {reply.name?.[0] ?? "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif font-bold text-xs">{reply.name}</span>
                    <span className="font-sans text-[.55rem] text-text-muted">
                      {formatDate(reply.createTime)}
                    </span>
                  </div>
                  <p className="font-kai text-sm leading-relaxed text-text-body/90">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
