import type { UUID } from "@/types/common/UUID"
import type { ItemGroupSummary } from "@/types/ItemGroup"
import { apiRoutes } from "@/lib/api/api-routes"
import useSWR from "swr"
import { ApiError, fetcher } from "@/lib/fetcher"

export function useItemGroups() {
  const { data, error, isLoading, mutate } = useSWR<
    ItemGroupSummary[],
    ApiError
  >(apiRoutes.itemGroups.collection, fetcher)

  function buildReordered(
    groups: ItemGroupSummary[] | undefined,
    orderedIds: UUID[],
  ) {
    const byId = new Map((groups ?? data ?? []).map((g) => [g.id, g]))
    return orderedIds
      .map((id, i) => {
        const g = byId.get(id)
        return g ? { ...g, position: i } : null
      })
      .filter((g): g is ItemGroupSummary => g !== null)
  }

  async function reorderItemGroups(orderedIds: UUID[]) {
    if (!data) return

    await mutate(
      async (groups) => {
        const res = await fetch(apiRoutes.itemGroups.reorder, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderedIds),
        })
        if (!res.ok) {
          throw new Error("Reorder failed")
        }
        return buildReordered(groups, orderedIds)
      },
      {
        optimisticData: (groups) => buildReordered(groups, orderedIds),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    )
  }

  return { itemGroups: data ?? [], isLoading, error, mutate, reorderItemGroups }
}
