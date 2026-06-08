export interface Social {
  name: string;
  url: string;
}

export interface SystemInfo {
  osName: string;
  osVersion: string;
  totalMemory: number;
  availableMemory: number;
  memoryUsage: number;
}

export interface WebInfo {
  url: string;
  title: string;
  subhead: string;
  favicon: string;
  description: string;
  keyword: string;
  footer: string;
  icp: string;
  create_time: number;
}

export type ArticleLayout = "classics" | "card" | "waterfall" | "";
export type RightSidebar =
  | "author"
  | "hotArticle"
  | "randomArticle"
  | "newComments"
  | "runTime"
  | "study";

export interface ThemeConfig {
  is_article_layout: string;
  right_sidebar: RightSidebar[];
  light_logo: string;
  dark_logo: string;
  swiper_image: string;
  swiper_text: string[];
  reco_article: number[];
  social: Social[];
  covers: string;
  record_name: string;
  record_info: string;
}

export interface OtherConfig {
  baidu_token: string;
  hcaptcha_key: string;
}

export interface EnvConfig {
  id: string;
  name: string;
  value: Record<string, unknown>;
  notes: string;
}
