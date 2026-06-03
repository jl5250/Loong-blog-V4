export interface WallCate {
  id: number;
  name: string;
  mark: string;
  order: number;
}

export interface Wall {
  id: number;
  name: string;
  cateId: number;
  cate: WallCate;
  color: string;
  content: string;
  email: string;
  auditStatus: number;
  createTime: string;
  h_captcha_response: string;
}
