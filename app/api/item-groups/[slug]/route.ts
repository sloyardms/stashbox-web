import { backendRoutes } from "@/lib/routes/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { createItemGroupPayloadSchema } from "@/lib/item-groups/validations"
import { NextRequest } from "next/server"
import z from "zod"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  return proxyToBackend(backendRoutes.itemGroups.bySlug(slug))
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const json = await req.json().catch(() => null)
  const parsed = createItemGroupPayloadSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(z.flattenError(parsed.error), { status: 400 })
  }

  return proxyToBackend(backendRoutes.itemGroups.bySlug(slug), {
    method: "PATCH",
    body: parsed.data,
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  return proxyToBackend(backendRoutes.itemGroups.bySlug(slug), {
    method: "DELETE",
  })
}
