import useSWR from "swr"
import { apiRoutes } from "@/lib/api/api-routes"
import { fetcher, ApiError } from "@/lib/fetcher"

export interface Profile {
  name: string
  email: string
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile, ApiError>(
    apiRoutes.auth.userinfo,
    fetcher,
  )
  return { profile: data, isLoading, error, mutate }
}
