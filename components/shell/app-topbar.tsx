"use client"

import { Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"
import { routes } from "@/lib/routes/routes"
import Link from "next/link"
import Image from "next/image"
import { SIDEBAR_WIDTH } from "@/lib/constants/layout-constants"

type AppTopbarProps = {
  onMenuClick?: () => void
  showSearch?: boolean
}

export function AppTopbar({ onMenuClick, showSearch = true }: AppTopbarProps) {
  return (
    <header className="flex flex-col border-b">
      <div className="flex h-16 items-center">
        <Button
          onClick={onMenuClick}
          variant="ghost"
          size="icon"
          className="ml-2 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link
          href={routes.home}
          className={`hidden md:flex ${SIDEBAR_WIDTH} h-full shrink-0 items-center gap-2 px-2`}
        >
          <Image
            src="/logo.svg"
            alt="stashbox"
            width={320}
            height={80}
            priority
            className="h-12 w-auto dark:invert"
          />
        </Link>

        <Link
          href={routes.home}
          className="flex items-center gap-2 px-2 md:hidden"
        >
          <Image
            src="/logo.svg"
            alt="stashbox"
            width={320}
            height={80}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {showSearch && (
          <div className="relative hidden max-w-xl flex-1 md:block">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input className="pl-8" placeholder="Search..." />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 px-4">
          <UserMenu />
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
          <Input className="pl-8" placeholder={""} value={""} />
        </div>
      </div>
    </header>
  )
}
