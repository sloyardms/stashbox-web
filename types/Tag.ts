import { UUID } from "./common/UUID"

export interface TagCount {
  id: UUID
  name: string
  slug: string
  itemCount: number
}
