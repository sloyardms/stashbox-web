import { apiRoutes } from "@/lib/api/api-routes"
import { toApiError } from "@/lib/fetcher"
import { toast } from "sonner"
import { mutate } from "swr"

export function useDeleteItemGroup() {
  async function deleteItemGroup(slug: string): Promise<void> {
    const res = await fetch(apiRoutes.itemGroups.bySlug(slug), {
      method: "DELETE",
    })

    if (!res.ok) throw await toApiError(res)

    await mutate(
      (key) =>
        typeof key === "string" &&
        key.startsWith(`${apiRoutes.itemGroups.collection}?`),
      undefined,
      { revalidate: true },
    )
  }

  return { deleteItemGroup }
}
