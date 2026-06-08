export interface Cate {
  id?: number;
  name: string;
  mark: string;
  url: string;
  level: number;
  type: "cate" | "nav";
  isHide?: boolean;
  count: number;
  order: number;
  children: Cate[];
}
export interface CateArticleCount {
  name: string;
  count: number;
}
