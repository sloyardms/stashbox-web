import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return proxyToBackend(req, "/api/v1/item-groups", {
    searchParams: new URL(req.url).searchParams,
  })
}
