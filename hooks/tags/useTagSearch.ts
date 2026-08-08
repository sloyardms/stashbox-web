import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { apiRoutes } from "@/lib/routes/api-routes"
import type { Page } from "@/types/common/Page"
import type { TagCount } from "@/types/Tag"

export function useTagSearch(groupSlug: string, search: string) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)

  const key = `${apiRoutes.itemGroups.tags.search(groupSlug)}?${params.toString()}`
  const { data, isLoading } = useSWR<Page<TagCount>>(key, fetcher)

  return { tags: data?.content ?? [], isLoading }
}
