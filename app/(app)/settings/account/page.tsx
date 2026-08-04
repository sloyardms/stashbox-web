"use client"

import { useUser } from "@/hooks/user/useUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConfirm } from "@/components/providers/confirm-provider"

export default function AccountPage() {
  const { user, isLoading } = useUser()
  const confirm = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete account",
      description:
        "This permanently deletes your account and everything in it. This can't be undone.",
      confirmLabel: "Delete account",
      variant: "destructive",
    })
    if (confirmed) {
      // call your delete-account endpoint here
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
