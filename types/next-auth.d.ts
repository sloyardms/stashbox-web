import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: string
    error?: "RefreshAccessTokenError" | "SessionRevoked"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    idToken?: string
    error?: "RefreshAccessTokenError" | "SessionRevoked"
  }
}
