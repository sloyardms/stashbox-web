import { backendRoutes } from "@/lib/routes/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  return proxyToBackend(backendRoutes.user.settings, {
    method: "PATCH",
    body,
  })
}
