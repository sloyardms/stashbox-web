import { betterAuth } from "better-auth"
import { genericOAuth, keycloak } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: "public-client-no-secret-required",
          issuer: process.env.KEYCLOAK_ISSUER!,
          scopes: ["openid", "profile", "email"],
          pkce: true,
        }),
        {
          providerId: "keycloak-signup",
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: "public-client-no-secret-required",
          authorizationUrl: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/registrations`,
          tokenUrl: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          userInfoUrl: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
          issuer: process.env.KEYCLOAK_ISSUER!,
          scopes: ["openid", "profile", "email"],
          pkce: true,
        },
      ],
    }),
  ],
})
