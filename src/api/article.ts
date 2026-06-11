import { request } from "./request";
import type { Article } from "@/types/article";
import type { Paginate } from "@/types/response";

export const getArticleData = (id: number, password?: string) =>
  request<Article>("GET", `/article${password ? `/${id}?password=${password}` : `/${id}`}`);

export const getArticleList = () =>
  request<Paginate<Article[]>>("GET", "/article");

export const getArticlePaging = (page: number, size: number, key?: string, cateId?: number, tagId?: number) =>
  request<Paginate<Article[]>>("GET", "/article", {
    params: { pageNum: page, pageSize: size, key, cateId, tagId },
  });

export const getRandomArticleList = () =>
  request<Article[]>("GET", "/article/random");

export const getRecommendedArticleList = (count?: number) =>
  request<Article[]>("GET", "/article/hot", {
    ...(count ? { params: { count } } : {}),
  });

export const recordView = (id: number) =>
  request<void>("GET", `/article/view/${id}`);
