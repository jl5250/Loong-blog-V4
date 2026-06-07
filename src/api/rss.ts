import { request } from "./request";
import type { Paginate } from "@/types/response";

export interface RssItem {
  author: string;
  image: string;
  email: string;
  type: string;
  title: string;
  description: string;
  url: string;
  createTime: string;
}

export const getRssList = () =>
  request<Paginate<RssItem[]>>("GET", "/rss");
