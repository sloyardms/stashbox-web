import { create } from "zustand"

type SelectedGroup = { id: string; name: string } | null

interface StashboxState {
  selectedGroup: SelectedGroup
  searchQuery: string
  setSelectedGroup: (group: SelectedGroup) => void
  setSearchQuery: (query: string) => void
}

export const useStashboxStore = create<StashboxState>((set) => ({
  selectedGroup: null,
  searchQuery: "",
  setSelectedGroup: (group) => set({ selectedGroup: group, searchQuery: "" }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
