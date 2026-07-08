"use client"

import { SWRConfig } from "swr"
import { useRouter } from "next/navigation"
import { ApiError, fetcher } from "@/lib/fetcher"

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: (err) => {
          // don't retry 401/403 — retrying an auth failure just spams the API
          return !(err instanceof ApiError && [401, 403].includes(err.status))
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status !== 401) {
            router.push("/")
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
