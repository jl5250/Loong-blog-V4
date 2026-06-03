import { request } from "./request";
import type { Comment } from "@/types/comment";
import type { Paginate } from "@/types/response";

/** 获取指定文章的评论 */
export const getArticleComments = (articleId: number) =>
  request<Paginate<Comment[]>>("POST", `/comment/article/${articleId}`, { body: {} });

/** 获取最新评论列表 */
export const getLatestComments = (page = 1, size = 5) =>
  request<Comment[]>("POST", "/comment/list", { body: { page, size } });
