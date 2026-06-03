import { request } from "./request";
import type { Wall, WallCate } from "@/types/wall";
import type { Paginate } from "@/types/response";

/** 获取留言分类列表 GET /api/wall/cate */
export const getWallCateList = () =>
  request<WallCate[]>("GET", "/wall/cate");

/** 获取留言列表 POST /api/wall/list (flat, pagination not supported) */
export const getWallList = (page = 1, size = 20) =>
  request<Wall[]>("POST", "/wall/list", { body: { page, size } });

/** 分页获取留言 POST /api/wall/paging */
export const getWallPaging = (page = 1, size = 12) =>
  request<Paginate<Wall[]>>("POST", `/wall/paging?page=${page}&size=${size}`, { body: {} });

/** 按分类分页获取留言 POST /api/wall/cate/{cateId} */
export const getWallCatePaging = (cateId: number, page = 1, size = 12) =>
  request<Paginate<Wall[]>>("POST", `/wall/cate/${cateId}?page=${page}&size=${size}`, { body: {} });

/** 获取单条留言 GET /api/wall/{id} */
export const getWallDetail = (id: number) =>
  request<Wall>("GET", `/wall/${id}`);

/** 新增留言 POST /api/wall */
export const addWallMessage = (data: Partial<Wall>) =>
  request<Wall>("POST", "/wall", { body: data });
