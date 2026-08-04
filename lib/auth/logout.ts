import { signOut } from "next-auth/react"

export async function logout(session?: { idToken?: string }) {
  await signOut({
    redirect: false,
  })

  const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!

  const params = new URLSearchParams({
    client_id: clientId,
    post_logout_redirect_uri: window.location.origin,
  })

  if (session?.idToken) {
    params.set("id_token_hint", session.idToken)
  }

  window.location.assign(`${issuer}/protocol/openid-connect/logout?${params}`)
}
