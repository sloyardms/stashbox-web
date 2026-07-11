import { ApiError } from "@/lib/fetcher"
import { mutate } from "swr"

export function useDeleteItemGroup() {
  async function deleteItemGroup(slug: string): Promise<void> {
    const res = await fetch(`/api/item-groups/${slug}`, { method: "DELETE" })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new ApiError(errBody.error ?? "Failed to delete group", res.status)
    }

    await mutate(
      (key) => typeof key === "string" && key.startsWith("/api/item-groups?"),
      undefined,
      { revalidate: true },
    )
  }

  return { deleteItemGroup }
}
