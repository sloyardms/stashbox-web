"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { logout } from "@/lib/logout"

export function AuthSessionHandler() {
  const { data: session } = useSession()

  useEffect(() => {
    if (
      session?.error === "RefreshAccessTokenError" ||
      session?.error === "SessionRevoked"
    ) {
      logout(session)
    }
  }, [session])

  return null
}
