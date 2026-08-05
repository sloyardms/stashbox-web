"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { logout } from "@/lib/auth/logout"
import { useProfile } from "@/hooks/user/useProfile"
import { Skeleton } from "../ui/skeleton"
import { cn } from "@/lib/utils"

export function UserMenu() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { data: session } = useSession()
  const { profile, isLoading, isValidating } = useProfile()

  if (isLoading) {
    return (
      <div
        className={cn(
          "transition-opacity duration-150",
          isLoading ? "opacity-100" : "absolute inset-0 opacity-0",
        )}
      >
        <UserMenuSkeleton />
      </div>
    )
  }

  if (!session?.user) return null

  // fallback
  const displayName = profile?.name ?? session.user.name
  const displayEmail = profile?.email ?? session.user.email
  const displayImage = profile?.picture ?? session.user.image

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      logout(session)
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <div
      className={cn(
        "transition-opacity duration-150",
        isLoading ? "opacity-0" : "opacity-100",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={displayImage ?? ""} />
                <AvatarFallback>
                  {displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-muted-foreground text-xs">{displayEmail}</p>
              </div>
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              }
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function UserMenuSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Skeleton className="h-8 w-8 rounded-full" />

      <div className="hidden space-y-1 md:block">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  )
}
