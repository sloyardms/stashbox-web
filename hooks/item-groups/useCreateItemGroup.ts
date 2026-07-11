import { mutate } from "swr"
import { postJson } from "@/lib/fetcher"
import type { ItemGroup } from "@/types/ItemGroup"
import type { CreateItemGroupPayload } from "@/lib/validations/item-groups"

export function useCreateItemGroup() {
  async function createItemGroup(
    payload: CreateItemGroupPayload,
  ): Promise<ItemGroup> {
    const created = await postJson<ItemGroup>("/api/item-groups", payload)

    await mutate(
      (key) => typeof key === "string" && key.startsWith("/api/item-groups?"),
      undefined,
      { revalidate: true },
    )

    return created
  }

  return { createItemGroup }
}
