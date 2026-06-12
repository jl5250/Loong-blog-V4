import { request } from "./request";
import type { Tag } from "@/types/tag";
import type { Article } from "@/types/article";

export const getTagList = () =>
  request<Tag[]>("GET", "/tag");

export const getTagArticles = (id: number) =>
  request<Article[]>("GET", `/article/tag/${id}`);
