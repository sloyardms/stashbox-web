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
import { routes } from "@/lib/routes/routes"
import { IconRenderer } from "../icon-picker/icon-renderer"
import { useConfirm } from "../providers/confirm-provider"
import { useDeleteItemGroup } from "@/hooks/item-groups/useDeleteGroup"
import { useState } from "react"
import { toast } from "sonner"
import { useSetDefaultItemGroup } from "@/hooks/item-groups/useSetDefaultItemGroup"
import { toastErrorMessage } from "@/lib/toast-error"

interface GroupItemProps {
  group: ItemGroupSummary
  active: boolean
}

export function GroupItem({ group, active }: GroupItemProps) {
  const router = useRouter()
  const confirm = useConfirm()
  const { deleteItemGroup } = useDeleteItemGroup()
  const [isDeleting, setIsDeleting] = useState(false)
  const { setDefaultItemGroup } = useSetDefaultItemGroup()

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
      toast.success(`Deleted "${group.name}"`)
      if (active) {
        router.push(routes.home)
      }
    } catch (error) {
      toast.error(toastErrorMessage(error, "Failed to delete group"))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetDefaultClick = async () => {
    try {
      await setDefaultItemGroup(group.slug)
      toast.success(`"${group.name}" set as default.`)
    } catch (error) {
      toast.error(
        toastErrorMessage(error, "Failed to set the group as default"),
      )
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
          active ? "text-foreground" : "text-muted-foreground",
        )}
      />
      <span className={cn("flex-1 truncate", active && "font-medium")}>
        {group.name}
      </span>

      <div className="relative flex h-6 w-6 items-center justify-center">
        <span className="pointer-events-none text-muted-foreground absolute text-xs transition-opacity group-hover:opacity-0">
          {group.itemCount}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="icon"
                variant="ghost"
                className="absolute h-6 w-6 pointer-events-none opacity-0 transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            }
          >
            <Icons.MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={handleEditClick}>
              <Icons.Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={group.defaultGroup}
              onClick={handleSetDefaultClick}
            >
              <Icons.Star className="mr-2 h-4 w-4" /> Set as default
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
    </div>
  )
}
