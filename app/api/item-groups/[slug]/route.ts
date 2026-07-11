import { backendRoutes } from "@/lib/api/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  return proxyToBackend(req, backendRoutes.itemGroups.bySlug(slug), {
    method: "DELETE",
  })
}
