import { backendRoutes } from "@/lib/api/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  return proxyToBackend(req, backendRoutes.user.settings, {
    method: "PATCH",
    body,
  })
}
