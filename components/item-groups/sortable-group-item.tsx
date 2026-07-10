"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type { ItemGroup } from "@/types/ItemGroup"
import { GroupItem } from "./group-item"
import { cn } from "@/lib/utils"

export function SortableGroupItem({
  group,
  active,
  onSelect,
}: {
  group: ItemGroup
  active: boolean
  onSelect: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id })

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
        "flex items-center gap-1 rounded-md transition-colors",
        active
          ? "bg-secondary text-primary shadow-sm"
          : "hover:bg-accent",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1"
      >
        <GripVertical
          className={cn(
            "h-3.5 w-3.5",
            active ? "text-primary" : "text-muted-foreground",
          )}
        />
      </button>
      <div className="min-w-0 flex-1">
        <GroupItem group={group} active={active} onSelect={onSelect} />
      </div>
    </div>
  )
}
