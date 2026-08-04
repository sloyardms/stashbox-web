import { THEME_COOKIE_NAME } from "@/lib/constants/cookie-constants"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get("redirect") ?? "/stashbox"
  const response = NextResponse.redirect(new URL(redirectTo, req.url))

  try {
    const meRes = await fetch(new URL("/api/me", req.url), {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    })

    if (!meRes.ok) {
      throw new Error(`Failed to fetch user: ${meRes.status}`)
    }

    const user = await meRes.json()

    response.cookies.set(
      THEME_COOKIE_NAME,
      user.settings.darkModeEnabled ? "dark" : "light",
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      },
    )
  } catch (err) {
    console.error("Failed to sync theme cookie:", err)
  }

  return response
}