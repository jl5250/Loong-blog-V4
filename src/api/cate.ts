import { request } from "./request";
import type { Cate, CateArticleCount } from "@/types/cate";

export const getCateList = () =>
  request<Cate[]>("GET", "/cate");

export const getCateById = (id: number) =>
  request<Cate>("GET", `/cate/${id}`);

export const getCateArticleCount = () =>
  request<CateArticleCount[]>("GET", "/cate/list");
