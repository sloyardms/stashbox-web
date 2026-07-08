"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useStashboxStore } from "@/lib/stashbox-store"
import { authClient } from "@/lib/auth-client"
import { UserMenu } from "./user-menu"
import { useRouter } from "next/navigation"

export function AppTopbar() {
  const selectedGroup = useStashboxStore((s) => s.selectedGroup)
  const searchQuery = useStashboxStore((s) => s.searchQuery)
  const setSearchQuery = useStashboxStore((s) => s.setSearchQuery)

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4">
      <div className="flex w-48 shrink-0 items-center gap-2 font-semibold">
        📦 stashbox
      </div>

      <div className="relative max-w-xl flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          className="pl-8"
          placeholder={
            selectedGroup ? `Search in ${selectedGroup.name}…` : "Search…"
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  )
}
