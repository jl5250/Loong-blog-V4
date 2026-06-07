import { request } from "./request";
import type { Tag } from "@/types/tag";

export const getTagList = () =>
  request<Tag[]>("GET", "/tag");
