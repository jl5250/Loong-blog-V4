import { request } from "./request";
import type { Record } from "@/types/record";
import type { Paginate } from "@/types/response";

export const getRecordList = (page = 1, size = 10) =>
  request<Record[]>("POST", "/record/list", { body: { page, size } });

export const getRecordPaging = (page = 1, size = 10) =>
  request<Paginate<Record[]>>("POST", `/record/paging?page=${page}&size=${size}`, { body: {} });
