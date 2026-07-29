"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserMenu } from "./user-menu"
import { routes } from "@/lib/routes"
import Link from "next/link"
import Image from "next/image"
import { SIDEBAR_WIDTH } from "@/lib/layout-constants"

export function AppTopbar() {
  return (
    <header className="flex h-16 items-center border-b">
      <Link
        href={routes.home}
        className={`flex ${SIDEBAR_WIDTH} h-full shrink-0 items-center gap-2 px-2`}
      >
        <Image
          src="/logo.svg"
          alt="stashbox"
          width={320}
          height={80}
          priority
          className="h-12 w-auto"
        />
      </Link>

      <div className="relative max-w-xl flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
        <Input className="pl-8" placeholder={""} value={""} />
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <UserMenu />
      </div>
    </header>
  )
}
