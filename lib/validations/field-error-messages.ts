const fieldErrorMessages: Record<string, string> = {
  "validation.max": "This value is too long.",
  "validation.min": "This value is too short.",
  "validation.required": "This field is required.",
  "validation.conflict": "This value is already in use.",
}

export function translateFieldError(code: string): string {
  return fieldErrorMessages[code] ?? "This value is invalid."
}
