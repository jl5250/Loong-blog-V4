import { request } from "./request";

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
  request<RssItem[]>("GET", "/rss/list");
