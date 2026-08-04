import { backendRoutes } from "@/lib/routes/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest) {
  const body = await req.json()
  return proxyToBackend(backendRoutes.itemGroups.reorder, {
    method: "PUT",
    body,
  })
}
