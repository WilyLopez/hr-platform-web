export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  status: "error";
  code: string;
  message: string;
  detail?: unknown;
}

export interface ApiSuccess<T = unknown> {
  status: "ok";
  data?: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export type SortOrder = "asc" | "desc";