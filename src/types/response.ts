/* API 响应通用类型 */

export interface ResponseData<T> {
  code: number;
  message: string;
  data: T;
}

export interface Paginate<T> {
  next: boolean;
  prev: boolean;
  pageNum: number;
  pageSize: number;
  pages: number;
  total: number;
  result: T;
}

export interface Page {
  page?: number;
  size?: number;
}

export interface FilterData {
  key?: string | null;
  startDate?: number | null;
  endDate?: number | null;
}
