"use client"

import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { Archive, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useItemGroups } from "@/hooks/item-groups/useItemGroups"
import { SortableGroupItem } from "@/components/item-groups/sortable-group-item"
import { routes } from "@/lib/routes"

export function AppSidebar() {
  const router = useRouter()

  const { itemGroups, error, isLoading, reorderItemGroups } = useItemGroups()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = itemGroups.findIndex((g) => g.id === active.id)
    const newIndex = itemGroups.findIndex((g) => g.id === over.id)
    const reordered = arrayMove(itemGroups, oldIndex, newIndex)
    await reorderItemGroups(reordered.map((g) => g.id))
  }

  const handleAddClick = () => {
    router.push(routes.groups.new)
  }

  const handleTrashbinClick = () => {
    router.push(routes.trashbin)
  }

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r">
      <nav className="p-2">
        <Button
          onClick={handleTrashbinClick}
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <Archive className="h-4 w-4" />
          Deleted Items
        </Button>
      </nav>

      <Separator />

      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-muted-foreground text-xs font-semibold">
          Groups
        </span>
        <Button
          onClick={handleAddClick}
          size="icon"
          variant="ghost"
          className="h-6 w-6"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        {isLoading && (
          <div className="text-muted-foreground px-2 text-sm">Loading...</div>
        )}
        {error && (
          <div className="text-destructive px-2 text-sm">
            Couldn't load groups.
          </div>
        )}
        {!isLoading && !error && itemGroups.length === 0 && (
          <div className="text-muted-foreground px-2 text-sm">
            No groups yet.
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemGroups.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            {itemGroups.map((group) => (
              <SortableGroupItem key={group.id} group={group} />
            ))}
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </aside>
  )
}
