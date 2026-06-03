import { request } from "./request";
import type { LoginReturn, UserInfo } from "@/types/user";

export const login = (username: string, password: string) =>
  request<LoginReturn>("POST", "/login", {
    body: { username, password },
  });

export const getAuthorInfo = () =>
  request<UserInfo>("GET", "/user/author");
