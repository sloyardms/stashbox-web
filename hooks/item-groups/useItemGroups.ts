import type { UUID } from "@/types/common/UUID"
import type { ItemGroupSummary } from "@/types/ItemGroup"
import { useEntityCollection } from "../shared/useEntityCollection"
import { apiRoutes } from "@/lib/api/api-routes"
import useSWR from "swr"
import { ApiError, fetcher } from "@/lib/fetcher"

export function useItemGroups() {
  const { data, error, isLoading, mutate } = useSWR<
    ItemGroupSummary[],
    ApiError
  >(apiRoutes.itemGroups.collection, fetcher)

  const itemGroups = data ?? []

  async function reorderItemGroups(orderedIds: UUID[]) {
    if (!data) return
    const byId = new Map(data.map((g) => [g.id, g]))
    const reordered = orderedIds
      .map((id, i) => {
        const g = byId.get(id)
        return g ? { ...g, position: i } : null
      })
      .filter((g): g is ItemGroupSummary => g !== null)

    await mutate(reordered, false)

    try {
      const res = await fetch(apiRoutes.itemGroups.reorder, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      })
      if (!res.ok) throw new Error("Reorder failed")
      await mutate()
    } catch (e) {
      await mutate()
      throw e
    }
  }

  return { itemGroups, isLoading, error, mutate, reorderItemGroups }
}
