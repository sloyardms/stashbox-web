"use client"

import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ItemGroupSummary } from "@/types/ItemGroup"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import { IconRenderer } from "../icon-picker/icon-renderer"
import { useConfirm } from "../providers/confirm-provider"
import { useDeleteItemGroup } from "@/hooks/item-groups/useDeleteGroup"
import { useState } from "react"
import { toast } from "sonner"
import { ApiError } from "@/lib/fetcher"

interface GroupItemProps {
  group: ItemGroupSummary
  active: boolean
}

export function GroupItem({ group, active }: GroupItemProps) {
  const router = useRouter()
  const confirm = useConfirm()
  const { deleteItemGroup } = useDeleteItemGroup()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditClick = () => {
    router.push(routes.groups.edit(group.slug))
  }

  const handleNavigateClick = () => {
    router.push(routes.groups.collection(group.slug))
  }

  const handleDeleteClick = async () => {
    const ok = await confirm({
      title: `Delete "${group.name}"?`,
      description:
        group.itemCount > 0
          ? `${group.itemCount} item(s) in this group will also be deleted. This action cannot be undone.`
          : "This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "destructive",
    })

    if (!ok) return

    setIsDeleting(true)

    try {
      await deleteItemGroup(group.slug)
      if (active) {
        router.push(routes.home)
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Couldn't delete group",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm transition-all",
      )}
      onClick={handleNavigateClick}
    >
      <IconRenderer
        icon={group.icon}
        fallback="Folder"
        className={cn(
          "mr-2 h-4 w-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span className={cn("flex-1 truncate", active && "font-medium")}>
        {group.name} ({group.itemCount})
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          }
        >
          <Icons.MoreHorizontal className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={handleEditClick}>
            <Icons.Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={group.defaultGroup || isDeleting}
            onClick={handleDeleteClick}
          >
            <Icons.Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting…" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
