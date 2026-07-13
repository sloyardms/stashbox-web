import { mutate } from "swr"
import { patchJson } from "@/lib/fetcher"
import type { ItemGroupDetail, ItemGroupSummary } from "@/types/ItemGroup"
import type { ItemGroupFormValues } from "@/lib/validations/item-groups"
import { toItemGroupPayload } from "@/lib/validations/item-groups"
import { apiRoutes } from "@/lib/api/api-routes"

export function useUpdateItemGroup() {
  async function updateItemGroup(slug: string, values: ItemGroupFormValues): Promise<ItemGroupDetail> {
    const updated = await patchJson<ItemGroupDetail>(
      apiRoutes.itemGroups.bySlug(slug),
      toItemGroupPayload(values),
    )

    await mutate(
      apiRoutes.itemGroups.collection,
      (groups: ItemGroupSummary[] | undefined) =>
        groups?.map((g) =>
          g.slug === slug
            ? { ...g, name: updated.name, slug: updated.slug, icon: updated.icon }
            : g,
        ),
      { revalidate: false },
    )

    await mutate(apiRoutes.itemGroups.bySlug(updated.slug), updated, false)

    if (updated.slug !== slug) {
      await mutate(apiRoutes.itemGroups.bySlug(slug), undefined, false)
    }

    return updated
  }
  return { updateItemGroup }
}
