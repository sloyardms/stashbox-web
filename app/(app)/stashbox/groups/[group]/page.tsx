"use client"

import { useParams } from "next/navigation"

import { useItemGroup } from "@/hooks/item-groups/useItemGroup"
import { StashItemGroupToolbar } from "@/components/stash-items/stash-item-group-toolbar"

export default function StashboxGroupPage() {
  const { group } = useParams<{ group: string }>()
  const { itemGroup, isLoading, isNotFound } = useItemGroup(group)

  if (isLoading) {
    return <div className="text-muted-foreground p-10 text-center text-sm">Loading…</div>
  }
  if (isNotFound || !itemGroup) {
    return <div className="text-muted-foreground p-10 text-center text-sm">Group not found.</div>
  }

  return (
    <div>
      <StashItemGroupToolbar group={itemGroup} />
      {/* tags filter panel + paginated item grid go below, for later */}
    </div>
  )
}