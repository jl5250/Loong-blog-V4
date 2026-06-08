import type { Page } from "./response";

export interface Comment {
  id?: number;
  name: string;
  avatar: string;
  email: string;
  url: string;
  content: string;
  articleId: number;
  articleTitle: string;
  commentId: number;
  status: number;
  children?: Comment[];
  createTime: number;
  h_captcha_response: string | null;
}

export interface CommentInfo {
  tab: string;
  loading: boolean;
  list: Comment[];
  paginate: Page;
}
