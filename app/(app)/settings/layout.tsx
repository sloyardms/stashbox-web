import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ConfirmProvider } from "@/components/providers/confirm-provider"
import { AppTopbar } from "@/components/shell/app-topbar"
import { SettingsNav } from "@/components/settings/settings-nav"

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/")
  }

  return (
    <ConfirmProvider>
      <div className="flex h-screen flex-col">
        <AppTopbar showSearch={false} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-4xl gap-10 px-6 py-10">
            <aside className="w-48 shrink-0">
              <h1 className="mb-4 px-3 text-lg font-semibold">Settings</h1>
              <SettingsNav />
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </main>
      </div>
    </ConfirmProvider>
  )
}
