"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"

const KEYCLOAK_ACCOUNT_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER! + "/account";

export default function ProfilePage() {
  const { profile, isLoading } = useProfile()

  if (isLoading || !profile) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Your name and email are managed through your account provider.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{profile.email}</dd>
          </div>
        </dl>
        <Button
          render={<a href={KEYCLOAK_ACCOUNT_URL}>Update profile</a>}
          nativeButton={false}
        />
      </CardContent>
    </Card>
  )
}
