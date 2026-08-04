"use client"

import { useUser } from "@/hooks/user/useUser"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"

export default function AppearancePage() {
  const { updateSettings } = useUser()
  const { theme, setTheme } = useTheme()

  const handleChange = async (value: "light" | "dark") => {
    const darkModeEnabled = value === "dark"
    setTheme(value)
    await updateSettings({ darkModeEnabled })
    await fetch("/api/settings/theme-cookie", {
      method: "POST",
      body: JSON.stringify({ darkModeEnabled }),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose how Stashbox looks on this device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={theme}
          onValueChange={handleChange}
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="theme-light"
            className="has-[[data-state=checked]]:border-foreground flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4"
          >
            <RadioGroupItem
              value="light"
              id="theme-light"
              className="sr-only"
            />
            <div className="h-16 w-full rounded border bg-white" />
            Light
          </Label>
          <Label
            htmlFor="theme-dark"
            className="has-[[data-state=checked]]:border-foreground flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4"
          >
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <div className="h-16 w-full rounded border bg-zinc-900" />
            Dark
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
