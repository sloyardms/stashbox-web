/**
 * Spring Boot endpoints, only used inside route.ts handlers
 */
export const backendRoutes = {
  itemGroups: {
    collection: "/api/v1/item-groups",
    bySlug: (slug: string) => `/api/v1/item-groups/${slug}`,
    reorder: "/api/v1/item-groups/reorder",
  },
} as const
