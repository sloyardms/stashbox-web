import { AppShell } from "@/components/shell/app-shell"
import { ConfirmProvider } from "@/components/providers/confirm-provider"

export default async function StashboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConfirmProvider>
      <AppShell>{children}</AppShell>
    </ConfirmProvider>
  )
}
