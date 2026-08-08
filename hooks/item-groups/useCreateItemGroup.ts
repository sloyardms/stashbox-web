import { mutate } from "swr"
import { postJson } from "@/lib/fetcher"
import type { ItemGroup, ItemGroupSummary } from "@/types/ItemGroup"
import type { CreateItemGroupPayload } from "@/lib/item-groups/validations"
import { apiRoutes } from "@/lib/routes/api-routes"

export function useCreateItemGroup() {
  async function createItemGroup(
    payload: CreateItemGroupPayload,
  ): Promise<ItemGroup> {
    const key = apiRoutes.itemGroups.collection

    const tempId = crypto.randomUUID()
    const optimisticGroup: ItemGroupSummary = {
      id: tempId,
      slug: `temp-${tempId}`,
      name: payload.name,
      icon: payload.icon,
      itemCount: 0,
    } as ItemGroupSummary

    let created!: ItemGroup

    function toSummary(detail: ItemGroup): ItemGroupSummary {
      return {
        id: detail.id,
        slug: detail.slug,
        name: detail.name,
        icon: detail.icon,
        itemCount: 0,
      } as ItemGroupSummary
    }

    await mutate(
      key,
      async (groups: ItemGroupSummary[] | undefined) => {
        created = await postJson<ItemGroup>(key, payload)
        return [...(groups ?? []), toSummary(created)]
      },
      {
        optimisticData: (groups: ItemGroupSummary[] | undefined) => [
          ...(groups ?? []),
          optimisticGroup,
        ],
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      },
    )

    return created
  }

  return { createItemGroup }
}
