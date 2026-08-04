"use client"

import { useUser } from "@/hooks/user/useUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function PreferencesPage() {
  const { user, updateSettings } = useUser()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="url-filters">Use URL filters</Label>
            <p className="text-muted-foreground text-sm">
              Automatically extract a title from pasted URLs using your
              configured URL filters when creating stash items.
            </p>
          </div>
          <Switch
            id="url-filters"
            checked={user?.settings.filtersEnabled ?? false}
            onCheckedChange={(checked) =>
              updateSettings({ filtersEnabled: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
