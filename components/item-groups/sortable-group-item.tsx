"use client"

import { useParams } from "next/navigation"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type { ItemGroupSummary } from "@/types/ItemGroup"
import { GroupItem } from "./group-item"
import { cn } from "@/lib/utils"

export function SortableGroupItem({ group }: { group: ItemGroupSummary }) {
  const params = useParams<{ group?: string }>()
  const active = params.group === group.slug

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center rounded-sm transition-colors",
        active ? "bg-accent" : "hover:bg-accent/50",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1"
      >
        <GripVertical
          aria-label={`reorder${group.slug}`}
          className={cn(
            "h-3.5 w-3.5",
            active ? "text-primary" : "text-muted-foreground",
          )}
        />
      </button>
      <div className="min-w-0 flex-1">
        <GroupItem group={group} active={active} />
      </div>
    </div>
  )
}
