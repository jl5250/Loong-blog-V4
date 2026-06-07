import { request } from "./request";
import type { Swiper } from "@/types/swiper";

/** 获取轮播图列表 */
export const getSwiperList = () =>
  request<Swiper[]>("GET", "/swiper");
