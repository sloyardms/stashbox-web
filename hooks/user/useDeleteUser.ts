import { deleteVoid } from "@/lib/fetcher"
import { apiRoutes } from "@/lib/routes/api-routes"

export function useDeleteUser() {
  async function selfDelete(): Promise<void> {
    try {
      await deleteVoid(apiRoutes.user.me)
    } catch (err) {
      throw err
    }
  }

  return { selfDelete }
}
