import { SIDEBAR_WIDTH } from "@/lib/layout-constants"
import { AppSidebarNavContent } from "./app-sidebar-nav-content"

export function AppSidebar() {
  return (
    <aside className={`hidden md:flex h-full ${SIDEBAR_WIDTH} shrink-0 flex-col border-r`}>
      <AppSidebarNavContent />
    </aside>
  )
}