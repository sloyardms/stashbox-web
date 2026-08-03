import { User, UserSettings } from "@/types/User"
import useSWR from "swr"
import { apiRoutes } from "@/lib/api/api-routes"
import { ApiError, fetcher, patchJson } from "@/lib/fetcher"

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<User, ApiError>(
    apiRoutes.user.me,
    fetcher,
    { dedupingInterval: 60_000 },
  )

  const updateSettings = async (patch: Partial<UserSettings>) => {
    if (!data) return

    await mutate(
      async () => {
        const updatedSettings = await patchJson<UserSettings>(
          apiRoutes.user.settings,
          patch,
        )
        return { ...data, settings: updatedSettings }
      },
      {
        optimisticData: { ...data, settings: { ...data.settings, ...patch } },
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    )
  }

  return { user: data, isLoading, error, mutate, updateSettings }
}
