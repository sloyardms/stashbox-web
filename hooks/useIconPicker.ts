"use client"

import { useMemo, useState } from "react"
import { itemGroupIcons } from "@/lib/item-groups/item-group-icons"

export function useIconPicker() {
  const [search, setSearch] = useState("")

  const icons = useMemo(
    () =>
      Object.entries(itemGroupIcons).map(([name, Icon]) => ({
        name,
        friendlyName: name.match(/[A-Z][a-z0-9]*/g)?.join(" ") ?? name,
        Icon,
      })),
    [],
  )

  const filteredIcons = useMemo(() => {
    if (!search) return icons
    const query = search.toLowerCase()
    return icons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.friendlyName.toLowerCase().includes(query),
    )
  }, [icons, search])

  return { search, setSearch, icons: filteredIcons }
}
