import { betterAuth } from "better-auth"
import { genericOAuth, keycloak } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
          clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET!,
          issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!,
          scopes: ["openid", "profile", "email"],
          pkce: true,
        }),
      ],
    }),
  ],
})
