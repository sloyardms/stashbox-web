"use client"

import { useUser } from "@/hooks/useUser"
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
            <p className="text-sm text-muted-foreground">
              Keep active filters in the page URL so they persist on reload and can be shared.
            </p>
          </div>
          <Switch
            id="url-filters"
            checked={user?.settings.filtersEnabled ?? false}
            onCheckedChange={(checked) => updateSettings({ filtersEnabled: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}