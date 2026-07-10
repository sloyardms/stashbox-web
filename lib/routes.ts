import { UUID } from "@/types/common/UUID"

export const routes = {
  home: "/stashbox",
  login: "/",
  trashbin: "/stashbox/trashbin",
  groups: {
    new: "/stashbox/groups/new",
    details: (id: UUID | number) => `/stashbox/groups/${id}`,
    edit: (id: UUID | number) => `/stashbox/groups/${id}/edit`,
  },
}
