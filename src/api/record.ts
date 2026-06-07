import { request } from "./request";
import type { Record } from "@/types/record";
import type { Paginate } from "@/types/response";

export const getRecordList = (page = 1, size = 10) =>
  request<Record[]>("GET", "/record", { params: { page, size } });

export const getRecordPaging = (page = 1, size = 10) =>
  request<Paginate<Record[]>>("GET", "/record", { params: { page, size } });
