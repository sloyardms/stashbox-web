import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function requireAccessToken(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const tokenResult = await auth.api
    .getAccessToken({
      body: { providerId: "keycloak" },
      headers: await headers(),
    })
    .catch(() => null)

  if (!tokenResult?.accessToken) {
    await auth.api.signOut({ headers: req.headers }).catch(() => null)
    return {
      error: Response.json(
        { error: "Session expired", reauth: true },
        { status: 401 },
      ),
    }
  }

  return { accessToken: tokenResult.accessToken }
}
