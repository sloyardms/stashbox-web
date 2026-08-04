import { jwtVerify, createRemoteJWKSet } from "jose"
import { revokeSession } from "@/lib/auth/session-revocation"

const JWKS = createRemoteJWKSet(
  new URL(
    `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/certs`,
  ),
)

export async function POST(req: Request) {
  const body = await req.formData()
  const logoutToken = body.get("logout_token")?.toString()
  if (!logoutToken) return new Response(null, { status: 400 })

  try {
    const { payload } = await jwtVerify(logoutToken, JWKS, {
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
      audience: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    })

    if (payload.nonce) return new Response(null, { status: 400 })
    if (!payload.events) return new Response(null, { status: 400 })
    if (!payload.sid) return new Response(null, { status: 400 })
    if (!payload.jti || !payload.exp) return new Response(null, { status: 400 })

    revokeSession(payload.sid as string)

    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 400 })
  }
}
