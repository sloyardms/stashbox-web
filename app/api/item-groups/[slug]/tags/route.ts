import { NextRequest } from "next/server"
import { backendRoutes } from "@/lib/routes/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  return proxyToBackend(backendRoutes.itemGroups.tags.search(slug), {
    searchParams: new URL(req.url).searchParams,
  })
}
