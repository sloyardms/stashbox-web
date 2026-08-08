import type { UUID } from "./common/UUID"
import { ItemGroup } from "./ItemGroup"

/**
 * POST response (StashItemDetailResponse DTO)
 */
export interface StashItemDetail {
  id: UUID
  group: ItemGroup
  title: string | null
  titleNormalized: string | null
  url: string | null
  urlNormalized: string | null
  description: string | null
  imagePath: string | null
  favorite: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}
