import { request } from "./request";
import type { Footprint } from "@/types/footprint";

export const getFootprintList = () =>
  request<Footprint[]>("POST", "/footprint/list");
