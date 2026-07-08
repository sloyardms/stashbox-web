"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import type { ItemGroup } from "@/types/ItemGroup"
import { GroupItem } from "./group-item"

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
    <div ref={setNodeRef} style={style} className="flex items-center gap-1">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1"
      >
        <GripVertical className="text-muted-foreground h-3.5 w-3.5" />
      </button>
      <div className="min-w-0 flex-1">
        <GroupItem group={group} active={active} onSelect={onSelect} />
      </div>
    </div>
  )
}
