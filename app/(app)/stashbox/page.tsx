"use client"

import { useItemGroups } from "@/hooks/item-groups/useItemGroups"
import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StashboxPage() {
  const router = useRouter()
  const { itemGroups, isLoading, error } = useItemGroups()

  useEffect(() => {
    if (isLoading || error || itemGroups.length === 0) return
    const target = itemGroups.find((g) => g.defaultGroup) ?? itemGroups[0]
    router.replace(`/stashbox/groups/${target.slug}`)
  }, [isLoading, error, itemGroups, router])

  if (error) {
    return (
      <div className="text-destructive p-4 text-sm">Couldn't load groups.</div>
    )
  }
  if (!isLoading && itemGroups.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        No groups yet.
      </div>
    )
  }
  return null
}
