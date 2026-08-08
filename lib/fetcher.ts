export interface ApiFieldError {
  field: string
  message: string
}

interface ProblemDetails {
  detail: string
  title: string
  status: number
  type: string
  traceId?: string
  fieldErrors?: ApiFieldError[]
}

export class ApiError extends Error {
  status: number
  fieldErrors?: ApiFieldError[]
  traceId?: string

  constructor(problem: ProblemDetails) {
    super(problem.detail)
    this.status = problem.status
    this.fieldErrors = problem.fieldErrors
    this.traceId = problem.traceId
  }
}

export async function toApiError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => null)
  if (body?.detail) {
    return new ApiError(body)
  }
  // fallback for non-Problem-Details errors (network failures, unexpected shapes)
  return new ApiError({
    detail: "Request failed",
    title: "Error",
    status: res.status,
    type: "urn:stashbox:error:unknown",
  })
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw await toApiError(res)
  return res.json()
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}

/**
 * MultiPart FormData POST request, used for file uploads. The body is a FormData object.
 */
export async function postFormData<T>(
  url: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}

export async function patchJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}

export async function putJsonVoid<T>(
  url: string,
  body: unknown,
): Promise<void> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw await toApiError(res)
}

export async function deleteVoid(url: string): Promise<void> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw await toApiError(res)
}
