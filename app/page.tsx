"use client"

import { ReactNode, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Link2, ImageIcon, FileText, Tags } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (isLoading) return
    setIsLoading(true)

    await authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: "/stashbox",
      errorCallbackURL: "/error-page",
      newUserCallbackURL: "/stashbox",
      disableRedirect: false,
    })
  }

  const handleRegister = async () => {
    if (isLoading) return
    setIsLoading(true)

    await authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: "/stashbox",
      errorCallbackURL: "/error-page",
      newUserCallbackURL: "/stashbox",
      disableRedirect: false,
    })
  }

  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/15 absolute top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-0 bottom-0 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <Badge className="mx-auto" variant="secondary">
            STASHBOX
          </Badge>

          <CardTitle className="text-4xl font-bold tracking-tight">
            Save anything.
            <br />
            Find it instantly.
          </CardTitle>

          <CardDescription className="text-base">
            Keep links, images, notes, and ideas organized with tags and
            groups—all private and searchable.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Feature icon={<Link2 className="h-4 w-4" />} text="Links" />
            <Feature icon={<ImageIcon className="h-4 w-4" />} text="Images" />
            <Feature icon={<FileText className="h-4 w-4" />} text="Notes" />
            <Feature icon={<Tags className="h-4 w-4" />} text="Tags & Groups" />
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Redirecting..." : "Login"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Redirecting..." : "Create account"}
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Your collections are private and only visible to you.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="bg-muted/40 flex items-center gap-2 rounded-lg border p-3">
      <div className="text-primary">{icon}</div>
      <span>{text}</span>
    </div>
  )
}
