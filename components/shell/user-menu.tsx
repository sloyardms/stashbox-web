"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Settings, LogOut, User } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { signOut } from "better-auth/api"

export function UserMenu() {
  const { data: session } = authClient.useSession()

  const user = session?.user
  if (!user) return null

  const handleLogout = async () => {
    const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}&client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}`

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = keycloakLogoutUrl
        },
      },
    })
  }

  const handleProfile = async () => {
    window.open(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/account`, "_blank")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

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
  )
}
