import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest) {
  const body = await req.json()
  return proxyToBackend(req, "/api/v1/item-groups/reorder", {
    method: "PUT",
    body,
  })
}
