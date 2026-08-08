import useSWR from "swr"
import { fetcher, ApiError } from "@/lib/fetcher"
import type { ItemGroup } from "@/types/ItemGroup"
import { apiRoutes } from "@/lib/routes/api-routes"

export function useItemGroup(slug: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<ItemGroup, ApiError>(
    slug ? apiRoutes.itemGroups.bySlug(slug) : null,
    fetcher,
  )

  return {
    itemGroup: data,
    isLoading,
    isNotFound: error?.status === 404,
    error,
    mutate,
  }
}
