"use client"

import { useUser } from "@/hooks/user/useUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirm } from "@/components/providers/confirm-provider"
import { useDeleteUser } from "@/hooks/user/useDeleteUser"
import { logout } from "@/lib/auth/logout"
import { toast } from "sonner"
import { toastErrorMessage } from "@/lib/toast-error"

export default function AccountPage() {
  const { user, isLoading } = useUser()
  const { selfDelete } = useDeleteUser()
  const confirm = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete account",
      description:
        "This will permanently delete your account and all associated data, including your stash items, tags, groups, and notes. This action cannot be undone.",
      confirmLabel: "Delete account",
      variant: "destructive",
    })
    
    if(!confirmed) return

    try{
      await selfDelete()
      await logout()
    } catch (err) {
      toast.error(toastErrorMessage(err, "Failed to delete account"))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isLoading && user && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Last updated</dt>
              <dd>{new Date(user.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        )}
        <div className="border-t pt-6">
          <p className="text-destructive mb-3 text-sm font-medium">
            Danger zone
          </p>
          <Button variant="destructive" onClick={handleDelete}>
            Delete account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
