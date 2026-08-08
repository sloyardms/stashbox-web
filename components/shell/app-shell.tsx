"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import { AppSidebarMobileSheet } from "./app-sidebar-mobile-sheet"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <AppTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <AppSidebarMobileSheet
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-3 py-3">{children}</div>
        </main>
      </div>
    </div>
  )
}
