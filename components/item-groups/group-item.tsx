"use client"

import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ItemGroup } from "@/types/ItemGroup"

interface GroupItemProps {
  group: ItemGroup
  active: boolean
  onSelect: () => void
}

export function GroupItem({ group, active, onSelect }: GroupItemProps) {
  function getGroupIcon(iconName: string): LucideIcon {
    return (
      (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Icons.Folder
    )
  }

  const Icon = getGroupIcon(group.icon)

  return (
    <div
      className={cn(
        "group hover:bg-accent flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm",
        active && "bg-accent font-medium",
      )}
      onClick={onSelect}
    >
      <Icon className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{group.name} ({group.itemCount})</span>

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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icons.Pencil className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Icons.Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
