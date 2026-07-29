const fieldErrorMessages: Record<string, string> = {
  "validation.max": "This value is too long.",
  "validation.min": "This value is too short.",
  "validation.notBlank": "This field is required.",
  "validation.conflict": "This value is already in use.",
  "validation.at_least_one_field_required": "Provide at least one of: title, URL, description, or image."
}

export function translateFieldError(code: string): string {
  return fieldErrorMessages[code] ?? "This value is invalid."
}
