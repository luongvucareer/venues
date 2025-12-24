/**
 * API Response Types
 */

export type ActionResponse<T = void> =
  | {
      success: true;
      data: T;
      message?: string;
      error?: never;
      errors?: never;
    }
  | {
      success: false;
      error: string;
      errors?: Record<string, string[] | undefined>;
      data?: never;
      message?: never;
    };

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
