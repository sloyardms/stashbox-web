import { mutate } from "swr"

/**
 * Next.js API routes, used with fetch() inside hooks
 */
export const apiRoutes = {
  itemGroups: {
    collection: "/api/item-groups",
    bySlug: (slug: string) => `/api/item-groups/${slug}`,
    reorder: "/api/item-groups/reorder",
  },
} as const

export function invalidateItemGroups() {
  return mutate(
    (key) =>
      typeof key === "string" &&
      key.startsWith(`${apiRoutes.itemGroups.collection}?`),
    undefined,
    { revalidate: true },
  )
}
