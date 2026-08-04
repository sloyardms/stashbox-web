import { decodeJwt, type JWTPayload } from "jose"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import Keycloak from "next-auth/providers/keycloak"
import { isSessionRevoked } from "./session-revocation"
import { SESSION_MAX_AGE_SECONDS } from "./constants"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
      client: { token_endpoint_auth_method: "none" },
      checks: ["pkce"],
      authorization: { params: { scope: "openid offline_access" } },
    }),
  ],
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {
      if (account) {
        const idTokenClaims: JWTPayload = account.id_token
          ? decodeJwt(account.id_token)
          : {}
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at as number) * 1000,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          sid: idTokenClaims.sid as string | undefined,
        }
      }

      if (token.sid && isSessionRevoked(token.sid as string)) {
        return { ...token, error: "SessionRevoked" }
      }

      if (Date.now() < (token.accessTokenExpires as number) - 10_000) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.idToken = token.idToken
      session.error = token.error
      return session
    },
  },
})

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken!,
        }),
      },
    )
    const refreshed = await res.json()
    if (!res.ok) throw refreshed
    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    }
  } catch {
    return { ...token, error: "RefreshAccessTokenError" }
  }
}