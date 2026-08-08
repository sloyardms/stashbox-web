import { NextRequest } from "next/server"
import { backendRoutes } from "@/lib/routes/backend-routes"
import { proxyToBackend } from "@/lib/api/bff-proxy"
import { createStashItemPayloadSchema } from "@/lib/validations/stash-items"
import { z } from "zod"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const incomingForm = await req.formData().catch(() => null)
  if (!incomingForm) {
    return Response.json({ error: "Invalid form data" }, { status: 400 })
  }

  const rawData = incomingForm.get("data")
  const rawText = typeof rawData === "string" ? rawData: rawData instanceof File ? await rawData.text() : null 
  const parsedJson = rawText ? JSON.parse(rawText) : null
  const parsed = createStashItemPayloadSchema.safeParse(parsedJson)

  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: z.flattenError(parsed.error) },
      { status: 400 },
    )
  }

  const outgoingForm = new FormData()
  outgoingForm.append(
    "data",
    new Blob([JSON.stringify(parsed.data)], { type: "application/json" }),
  )

  const image = incomingForm.get("image")
  if (image instanceof File && image.size > 0) {
    outgoingForm.append("image", image)
  }

  return proxyToBackend(
    backendRoutes.itemGroups.stashItems.collection(slug),
    {
      method: "POST",
      body: outgoingForm,
    },
  )
}
