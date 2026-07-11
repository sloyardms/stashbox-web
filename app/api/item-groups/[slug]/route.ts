import { proxyToBackend } from "@/lib/api/bff-proxy"
import { NextRequest } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  return proxyToBackend(req, `/api/v1/item-groups/${slug}`, { method: "DELETE" })
}
