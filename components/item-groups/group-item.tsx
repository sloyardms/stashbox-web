"use client"

import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ItemGroup } from "@/types/ItemGroup"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import Link from "next/link"
import { IconRenderer } from "../icon-picker/icon-renderer"

interface GroupItemProps {
  group: ItemGroup
  active: boolean
}

export function GroupItem({ group, active }: GroupItemProps) {
  const router = useRouter()

  const handleEditClick = () => {
    router.push(routes.groups.edit(group.slug))
  }

  const handleNavigateClick = () => {
    router.push(routes.groups.details(group.slug))
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

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditClick}>
            <Icons.Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Icons.Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
