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
import { AlertCircle, Archive, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useItemGroups } from "@/hooks/item-groups/useItemGroups"
import { SortableGroupItem } from "@/components/item-groups/sortable-group-item"
import { routes } from "@/lib/routes/routes"
import { Skeleton } from "../ui/skeleton"
import { cn } from "@/lib/utils"

export function AppSidebarNavContent() {
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

  const handleAddClick = () => router.push(routes.groups.new)
  const handleTrashbinClick = () => router.push(routes.trashbin)

  return (
    <div className="flex h-full flex-col">
      <nav className="mt-4 px-1 py-2">
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
          <div
            className={cn(
              "transition-opacity duration-150",
              isLoading ? "opacity-100" : "absolute inset-0 opacity-0",
            )}
          >
            <SidebarGroupsSkeleton />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center px-4 py-6 text-center">
            <AlertCircle className="text-destructive mb-2 h-6 w-6" />

            <p className="font-medium">Couldn't load groups</p>

            <p className="text-muted-foreground mt-1 text-xs">
              Please check your connection.
            </p>
          </div>
        )}
        {!isLoading && !error && itemGroups.length === 0 && (
          <div className="text-muted-foreground px-2 text-sm">
            No groups yet.
          </div>
        )}

        <div
          className={cn(
            "transition-opacity duration-150",
            isLoading ? "opacity-0" : "opacity-100",
          )}
        >
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
        </div>
      </ScrollArea>
    </div>
  )
}

function SidebarGroupsSkeleton() {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center rounded-sm">
          <div className="flex items-center px-1">
            <Skeleton className="h-3.5 w-3.5 rounded-sm" />
          </div>
          <div className="flex min-w-0 flex-1 items-center px-2 py-1.5">
            <Skeleton className="mr-2 h-4 w-4 shrink-0 rounded-sm" />
            <Skeleton
              className="h-3.5 rounded-sm"
              style={{ width: i === 0 ? "55%" : i === 1 ? "70%" : "40%" }}
            />
            <div className="flex-1" />
            <div className="flex h-6 w-6 items-center justify-center">
              <Skeleton className="h-3 w-3 rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
