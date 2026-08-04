import { auth } from "@/lib/auth"

export async function requireAccessToken() {
  const session = await auth()

  if (!session || session.error === "RefreshAccessTokenError") {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  if (!session.accessToken) {
    return {
      error: Response.json(
        { error: "Session expired", reauth: true },
        { status: 401 },
      ),
    }
  }
  return { accessToken: session.accessToken }
}
