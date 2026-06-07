import { request } from "./request";
import type { WebInfo, ThemeConfig, OtherConfig } from "@/types/config";

export const getWebInfo = () =>
  request<{ id: number; name: string; value: WebInfo }>("GET", "/web_config/name/web");

/** Theme config from /api/web_config/name/theme (value is wrapped) */
export const getThemeConfig = () =>
  request<{ id: number; name: string; value: ThemeConfig }>("GET", "/web_config/name/theme");

/** Page config by name from /api/page_config/name/{name} */
export const getPageConfig = <T = any>(name: string) =>
  request<{ id: number; name: string; value: T }>("GET", `/page_config/name/${name}`);

/** Gaode map config from /api/env_config/gaode_map */
export const getGaodeMapConfig = () =>
  request<{ key_code: string; security_code: string }>("GET", "/env_config/gaode_map");

/** Other config (baidu_token, hcaptcha_key) from /api/web_config/name/other */
export const getOtherConfig = () =>
  request<{ id: number; name: string; value: OtherConfig }>("GET", "/web_config/name/other");
