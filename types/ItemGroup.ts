import type { UUID } from "./common/UUID"

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

export interface ItemGroupSettings {
  requiredTitle: boolean
  uniqueTitle: boolean
  requiredUrl: boolean
  uniqueUrl: boolean
  requiredImage: boolean
}
