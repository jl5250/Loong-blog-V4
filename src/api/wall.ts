import { request } from "./request";
import type { Wall, WallCate } from "@/types/wall";
import type { Paginate } from "@/types/response";

/** 获取留言分类列表 */
export const getWallCateList = () =>
  request<WallCate[]>("GET", "/wall/cate");

/** 获取留言列表 */
export const getWallList = (page = 1, size = 20) =>
  request<Wall[]>("GET", "/wall", { params: { page, size } });

/** 分页获取留言 */
export const getWallPaging = (page = 1, size = 12) =>
  request<Paginate<Wall[]>>("GET", "/wall", { params: { page, size } });

/** 按分类分页获取留言 */
export const getWallCatePaging = (cateId: number, page = 1, size = 12) =>
  request<Paginate<Wall[]>>("GET", `/wall/cate/${cateId}`, { params: { page, size } });

/** 获取单条留言 */
export const getWallDetail = (id: number) =>
  request<Wall>("GET", `/wall/${id}`);

/** 新增留言 */
export const addWallMessage = (data: Partial<Wall>) =>
  request<Wall>("POST", "/wall", { body: data });
