import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AppShell } from "@/components/shell/app-shell"
import { ConfirmProvider } from "@/components/providers/confirm-provider"

export default async function StashboxLayout({
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
      <AppShell>{children}</AppShell>
    </ConfirmProvider>
  )
}
