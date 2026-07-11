/**
 * Pages, used with router.push()
 */
export const routes = {
  home: "/stashbox",
  login: "/",
  trashbin: "/stashbox/trashbin",
  groups: {
    new: "/stashbox/groups/new",
    collection: (slug: string) => `/stashbox/groups/${slug}`,
    edit: (slug: string) => `/stashbox/groups/${slug}/edit`,
  },
} as const
