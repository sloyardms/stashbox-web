import { UUID } from "@/types/common/UUID"

export const routes = {
  home: "/stashbox",
  login: "/",
  trashbin: "/stashbox/trashbin",
  groups: {
    new: "/stashbox/groups/new",
    details: (slug: string) => `/stashbox/groups/${slug}`,
    edit: (slug: string) => `/stashbox/groups/${slug}/edit`,
  },
}

export const apiRoutes = {
  itemGroups: {
    getall: "/api/v1/item-groups",
    create: "/api/v1/item-groups",
  },
}
