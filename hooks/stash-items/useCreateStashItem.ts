import { mutate } from "swr"
import { postFormData } from "@/lib/fetcher"
import { apiRoutes } from "@/lib/routes/api-routes"
import type { StashItemDetail } from "@/types/StashItem"
import type { ItemGroupSummary } from "@/types/ItemGroup"
import {
  toStashItemFormData,
  type CreateStashItemPayload,
} from "@/lib/validations/stash-items"

export function useCreateStashItem(groupSlug: string) {
  async function createStashItem(
    payload: CreateStashItemPayload,
    image: File | null,
  ): Promise<StashItemDetail> {
    const formData = toStashItemFormData(payload, image)
    const created = await postFormData<StashItemDetail>(
      apiRoutes.itemGroups.stashItems.collection(groupSlug),
      formData,
    )

    // update the item count for the group in the item groups collection cache
    mutate(
      apiRoutes.itemGroups.collection,
      (groups: ItemGroupSummary[] | undefined) =>
        groups?.map((g) =>
          g.slug === groupSlug ? { ...g, itemCount: g.itemCount + 1 } : g,
        ),  
      { revalidate: false },
    )

    // revalidate the stash items collection cache for the group
    mutate(apiRoutes.itemGroups.stashItems.collection(groupSlug))

    return created
  }

  return { createStashItem }
}
