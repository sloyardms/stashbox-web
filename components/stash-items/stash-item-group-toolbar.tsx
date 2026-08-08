"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ListFilter, Plus, Settings2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { StashItemForm } from "./stash-item-form"
import { useCreateStashItem } from "@/hooks/stash-items/useCreateStashItem"
import { routes } from "@/lib/routes/routes"
import type { ItemGroup } from "@/types/ItemGroup"
import type { CreateStashItemPayload } from "@/lib/validations/stash-items"

interface StashItemGroupToolbarProps {
  group: ItemGroup
}

export function StashItemGroupToolbar({ group }: StashItemGroupToolbarProps) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const { createStashItem } = useCreateStashItem(group.slug)

  async function handleCreate(
    payload: CreateStashItemPayload,
    image: File | null,
  ) {
    await createStashItem(payload, image)
    toast.success("Item added.")
    setCreateOpen(false)
  }

  return (
    <div className="border-border flex items-center justify-between border-b px-3 py-2">
      <h1 className="text-foreground text-lg font-semibold">{group.name}</h1>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          // TODO filters CRUD not built yet — wire this up when /groups/[slug]/filters exists
          onClick={() =>
            router.push(`${routes.groups.collection(group.slug)}/filters`)
          }
        >
          <ListFilter className="size-4" />
          Filters
        </Button>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New item
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(routes.groups.edit(group.slug))}
        >
          <Settings2 className="size-4" />
        </Button>
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-md min-w-1/4 overflow-y-auto"
        >
          <StashItemForm
            group={group}
            settings={group.settings}
            onSubmit={handleCreate}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
