import { useSWRConfig } from "swr"
import { apiRoutes } from "@/lib/api/api-routes"
import { toApiError } from "@/lib/fetcher"
import type { ItemGroupSummary } from "@/types/ItemGroup"

export function useDeleteItemGroup() {
  const { mutate, cache } = useSWRConfig()

  async function deleteItemGroup(slug: string): Promise<void> {
    const key = apiRoutes.itemGroups.collection
    const previous = cache.get(key)?.data as ItemGroupSummary[] | undefined

    try {
      const res = await fetch(apiRoutes.itemGroups.bySlug(slug), {
        method: "DELETE",
      })

      if (!res.ok) throw await toApiError(res)

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
