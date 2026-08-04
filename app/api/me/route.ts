import { backendRoutes } from "@/lib/routes/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return proxyToBackend(backendRoutes.user.me)
}
