import { mutate } from "swr"
import { apiRoutes } from "@/lib/routes/api-routes"
import { putJsonVoid } from "@/lib/fetcher"
import type { ItemGroupSummary } from "@/types/ItemGroup"

export function useSetDefaultItemGroup() {
  async function setDefaultItemGroup(slug: string): Promise<void> {
    const key = apiRoutes.itemGroups.collection

    function withNewDefault(
      groups: ItemGroupSummary[] | undefined,
    ): ItemGroupSummary[] {
      return (groups ?? []).map((g) => ({
        ...g,
        defaultGroup: g.slug === slug,
      }))
    }

    await mutate(
      key,
      async (groups: ItemGroupSummary[] | undefined) => {
        await putJsonVoid(apiRoutes.itemGroups.setDefault(slug), undefined)
        return withNewDefault(groups)
      },
      {
        optimisticData: withNewDefault,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    )
  }

  return { setDefaultItemGroup }
}
