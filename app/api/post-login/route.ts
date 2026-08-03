import { THEME_COOKIE_NAME } from "@/lib/theme-cookie"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get("redirect") ?? "/stashbox"
  const response = NextResponse.redirect(new URL(redirectTo, req.url))

  if (!req.cookies.has(THEME_COOKIE_NAME)) {
    try {
      const meRes = await fetch(new URL("/api/me", req.url), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
      })
      const user = await meRes.json()
      response.cookies.set(
        THEME_COOKIE_NAME,
        user.settings.darkModeEnabled ? "dark" : "light",
        { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" },
      )
    } catch (err) {
      console.error("post-login me fetch threw:", err)
    }
  }

  return response
}
