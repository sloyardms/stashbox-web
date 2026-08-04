/**
 * Spring Boot endpoints, only used inside route.ts handlers
 */
export const backendRoutes = {
  itemGroups: {
    collection: "/api/v1/item-groups",
    bySlug: (slug: string) => `/api/v1/item-groups/${slug}`,
    reorder: "/api/v1/item-groups/reorder",
    setDefault: (slug: string) => `/api/v1/item-groups/${slug}/default`,
  },
  user: {
    me: "/api/v1/users/me",
    settings: "/api/v1/users/me/settings",
  },
} as const
