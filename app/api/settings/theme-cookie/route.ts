import { THEME_COOKIE_NAME } from "@/lib/constants/cookie-constants"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { darkModeEnabled } = (await request.json()) as {
    darkModeEnabled: boolean
  }

  const cookieStore = await cookies()
  cookieStore.set(THEME_COOKIE_NAME, darkModeEnabled ? "dark" : "light", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  })

  return NextResponse.json({ ok: true })
}
