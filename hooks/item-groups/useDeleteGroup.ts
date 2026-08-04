import { useSWRConfig } from "swr"
import { apiRoutes } from "@/lib/routes/api-routes"
import { deleteVoid, toApiError } from "@/lib/fetcher"
import type { ItemGroupSummary } from "@/types/ItemGroup"

export function useDeleteItemGroup() {
  const { mutate, cache } = useSWRConfig()

  async function deleteItemGroup(slug: string): Promise<void> {
    const key = apiRoutes.itemGroups.collection
    const previous = cache.get(key)?.data as ItemGroupSummary[] | undefined

    try {
      await deleteVoid(apiRoutes.itemGroups.bySlug(slug))
      await mutate(
        key,
        previous?.filter((g) => g.slug !== slug),
        { revalidate: false },
      )
      await mutate(apiRoutes.itemGroups.bySlug(slug), undefined, false)
    } catch (err) {
      await mutate(key, previous, false)
      throw err
    }
  }

  return { deleteItemGroup }
}
