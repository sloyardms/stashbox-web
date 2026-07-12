import { betterAuth } from "better-auth"
import { genericOAuth, keycloak } from "better-auth/plugins"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.BETTER_AUTH_DATABASE_URL,
  }),
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
          clientSecret: "public-client-no-secret-required",
          issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!,
          scopes: ["openid", "profile", "email"],
          pkce: true,
        }),
      ],
    }),
  ],
})
