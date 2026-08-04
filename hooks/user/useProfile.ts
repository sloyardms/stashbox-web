import useSWR, { mutate } from "swr"
import { apiRoutes } from "@/lib/routes/api-routes"
import { fetcher, ApiError } from "@/lib/fetcher"

export interface Profile {
  name: string
  email: string
  picture?: string
}

export function useProfile() {
  const { data, error, isLoading } = useSWR<Profile, ApiError>(
    apiRoutes.auth.userinfo,
    fetcher,
  )
  return { profile: data, isLoading, error }
}

export function revalidateProfile() {
  return mutate(apiRoutes.auth.userinfo)
}