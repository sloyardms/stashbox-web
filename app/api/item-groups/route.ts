import { proxyToBackend } from "@/lib/api/bff-proxy"
import { createItemGroupPayloadSchema } from "@/lib/validations/item-groups"
import { NextRequest } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  return proxyToBackend(req, "/api/v1/item-groups", {
    searchParams: new URL(req.url).searchParams,
  })
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = createItemGroupPayloadSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: z.flattenError(parsed.error) },
      { status: 400 },
    )
  }

  return proxyToBackend(req, "/api/v1/item-groups", {
    method: "POST",
    body: parsed.data,
  })
}
