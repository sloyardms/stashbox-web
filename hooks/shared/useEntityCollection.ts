import useSWR, { SWRConfiguration } from "swr"
import { fetcher, ApiError } from "@/lib/fetcher"
import type { Page } from "@/types/common/Page"

interface UseEntityCollectionParams<T> {
  endpoint: string;
  page?: number;
  size?: number;
  sort?: string;
  swr?: SWRConfiguration<Page<T>, ApiError>;
}

export function useEntityCollection<T>({
  endpoint,
  page = 0,
  size = 20,
  sort,
  swr,
}: UseEntityCollectionParams<T>) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (sort) params.set("sort", sort);

  const { data, error, isLoading, mutate } = useSWR<Page<T>, ApiError>(
    `${endpoint}?${params.toString()}`,
    fetcher,
    swr
  );

  return {
    items: data?.content ?? [],
    pageInfo: data
      ? {
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
          isFirst: data.first,
          isLast: data.last,
        }
      : undefined,
    isLoading,
    isUnauthorized: error?.status === 401,
    error,
    data,
    mutate,
  }
}
