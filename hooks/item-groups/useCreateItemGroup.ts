import { mutate } from "swr"
import { postJson } from "@/lib/fetcher"
import type { ItemGroup } from "@/types/ItemGroup"
import type { CreateItemGroupPayload } from "@/lib/validations/item-groups"
import { apiRoutes } from "@/lib/api/api-routes"
import { toast } from "sonner"

export function useCreateItemGroup() {
  async function createItemGroup(
    payload: CreateItemGroupPayload,
  ): Promise<ItemGroup> {
    const route = apiRoutes.itemGroups.collection
    const created = await postJson<ItemGroup>(route, payload)

    await mutate(
      (key) => typeof key === "string" && key.startsWith(`${route}?`),
      undefined,
      { revalidate: true },
    )

    toast.success("Group created", {
      description: `"${created.name}" has been created.`,
    })
    
    return created
  }

  return { createItemGroup }
}
