import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  )
  if (!res.ok) return Response.json({ error: "Failed" }, { status: res.status })
  return Response.json(await res.json())
}
