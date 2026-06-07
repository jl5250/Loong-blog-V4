import { request } from "./request";
import type { Web, WebType } from "@/types/web";

/** 获取网站列表 */
export const getLinkList = () =>
  request<Web[]>("GET", "/link");

/** 获取网站类型列表 GET /api/link/type */
export const getLinkTypeList = () =>
  request<WebType[]>("GET", "/link/type");

/** 新增友链 POST /api/link */
export const addLink = (data: Partial<Web>) =>
  request<Web>("POST", "/link", { body: data });
