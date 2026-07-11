"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserMenu } from "./user-menu"
import { routes } from "@/lib/routes"
import Link from "next/link"

export function AppTopbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b px-4">
      <Link
        href={routes.home}
        className="flex w-48 shrink-0 items-center gap-2 font-semibold"
      >
        📦 stashbox
      </Link>

      <div className="relative max-w-xl flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input className="pl-8" placeholder={""} value={""} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  )
}
