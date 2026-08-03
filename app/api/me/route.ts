import { backendRoutes } from "@/lib/api/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return proxyToBackend(req, backendRoutes.user.me)
}
