import { requireAccessToken } from "./bff-auth"

const BACKEND_URL = process.env.BACKEND_URL

interface ProxyOptions {
  method?: string
  body?: unknown
  searchParams?: URLSearchParams
}

export async function proxyToBackend(
  path: string,
  { method = "GET", body, searchParams }: ProxyOptions = {},
) {
  const { accessToken, error } = await requireAccessToken()
  if (error) return error

  const qs = searchParams?.toString()
  const url = `${BACKEND_URL}${path}${qs ? `?${qs}` : ""}`
  const isFormData = body instanceof FormData

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    cache: "no-store",
  })

  if (response.status === 401) {
    return Response.json({ error: "Session expired" }, { status: 401 })
  }
  if (!response.ok) {
    const problem = await response.json().catch(() => null)
    return Response.json(
      problem ?? {
        detail: "Request failed",
        title: "Error",
        status: response.status,
      },
      { status: response.status },
    )
  }
  if (response.status === 204) return new Response(null, { status: 204 })

  return Response.json(await response.json())
}
