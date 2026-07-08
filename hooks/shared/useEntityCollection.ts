// hooks/shared/useEntityCollection.ts
import useSWR from "swr"
import { fetcher, ApiError } from "@/lib/fetcher"
import type { Page } from "@/types/common/Page"

interface UseEntityCollectionParams {
  endpoint: string
  page?: number
  size?: number
  sort?: string
}

export function useEntityCollection<T>({
  endpoint,
  page = 0,
  size = 20,
  sort,
}: UseEntityCollectionParams) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (sort) params.set("sort", sort)

  const { data, error, isLoading, mutate } = useSWR<Page<T>, ApiError>(
    `${endpoint}?${params.toString()}`,
    fetcher,
  )

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
