import type { UUID } from "./common/UUID"

export interface ItemGroupSettings {
  requiredTitle: boolean
  uniqueTitle: boolean
  requiredUrl: boolean
  uniqueUrl: boolean
  requiredImage: boolean
}

/**
 * GET /api/v1/item-groups mirrors ItemGroupWithCount projection
 */
export interface ItemGroupSummary {
  id: UUID
  name: string
  slug: string
  icon: string
  defaultGroup: boolean
  position: number
  itemCount: number
}

/**
 * GET by slug, POST, PATCH — mirrors ItemGroupDetail
 */
export interface ItemGroup {
  id: UUID
  name: string
  slug: string
  description: string
  icon: string
  defaultGroup: boolean
  position: number
  settings: ItemGroupSettings
  createdAt: string
  updatedAt: string
}
