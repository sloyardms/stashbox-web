import type { UUID } from "./common/UUID"

export interface User {
  id: UUID
  settings: UserSettings
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  darkModeEnabled: boolean
  filtersEnabled: boolean
}
