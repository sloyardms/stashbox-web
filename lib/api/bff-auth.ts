import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function requireAccessToken(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session)
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) }

  const tokenResult = await auth.api
    .getAccessToken({ body: { providerId: "keycloak" }, headers: req.headers })
    .catch(() => null)

  const accessToken = tokenResult?.accessToken
  if (!accessToken)
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) }

  return { accessToken }
}
