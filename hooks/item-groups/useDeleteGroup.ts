import { apiRoutes } from "@/lib/api/api-routes"
import { ApiError } from "@/lib/fetcher"
import { toast } from "sonner"
import { mutate } from "swr"

export function useDeleteItemGroup() {
  async function deleteItemGroup(slug: string): Promise<void> {
    const res = await fetch(apiRoutes.itemGroups.bySlug(slug), {
      method: "DELETE",
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new ApiError(errBody.error ?? "Failed to delete group", res.status)
    }

    toast.success("Group deleted")

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
