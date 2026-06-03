import { request } from "./request";
import type { Swiper } from "@/types/swiper";

/** 获取轮播图列表 (POST /api/swiper/list) */
export const getSwiperList = () =>
  request<Swiper[]>("POST", "/swiper/list", { body: {} });
