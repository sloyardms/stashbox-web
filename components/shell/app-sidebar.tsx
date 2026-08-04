import { SIDEBAR_WIDTH } from "@/lib/constants/layout-constants"
import { AppSidebarNavContent } from "./app-sidebar-nav-content"
import packageJson from "@/package.json"

export function AppSidebar() {
  return (
    <aside
      className={`hidden h-full md:flex ${SIDEBAR_WIDTH} shrink-0 flex-col border-r`}
    >
      <div className="flex-1 overflow-y-auto">
        <AppSidebarNavContent />
      </div>

      <div className="text-muted-foreground border-t px-4 py-3 text-xs">
        Stashbox v{packageJson.version}
      </div>
    </aside>
  )
}
