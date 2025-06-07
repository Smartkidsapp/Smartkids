import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export interface PaginatedListResponse<T> {
  page: number;
  has_more: boolean;
  per_page: number;
  count: number;
  pages_count: number;
  data: T[];
}

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}
