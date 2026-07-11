import type { UUID } from "@/types/common/UUID"
import type { ItemGroup } from "@/types/ItemGroup"
import { useEntityCollection } from "../shared/useEntityCollection"

export function useItemGroups(params: { page?: number; size?: number } = {}) {
  const { items, mutate, data, ...rest } = useEntityCollection<ItemGroup>({
    endpoint: "/api/item-groups",
    sort: "position,asc",
    ...params,
  })

  async function reorderItemGroups(orderedIds: UUID[]) {
    if (!data) return
    const byId = new Map(items.map((g) => [g.id, g]))
    const reordered = orderedIds
      .map((id, i) => {
        const g = byId.get(id)
        return g ? { ...g, position: i } : null
      })
      .filter((g): g is ItemGroup => g !== null)

    await mutate({ ...data, content: reordered }, false)
    try {
      const res = await fetch("/api/item-groups/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderedIds),
      })
      if (!res.ok) throw new Error("Reorder failed")
      await mutate()
    } catch (e) {
      await mutate()
      throw e
    }
  }

  return { itemGroups: items, reorderItemGroups, ...rest }
}
