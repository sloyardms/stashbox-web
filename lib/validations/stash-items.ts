import { z } from "zod"
import type { ItemGroupSettings } from "@/types/ItemGroup"

export function buildStashItemFormSchema(settings: ItemGroupSettings) {
  return z
    .object({
      title: z.string().trim().max(255, "Max 255 characters"),
      url: z.string().trim().max(2048, "Max 2048 characters"),
      description: z.string().trim().max(500, "Max 500 characters"),
      tags: z.array(z.string().trim().min(1)),
      image: z.instanceof(File).nullable(),
    })
    .superRefine((values, ctx) => {
      if (settings.requiredTitle && !values.title) {
        ctx.addIssue({
          code: "custom",
          message: "Title is required",
          path: ["title"],
        })
      }
      if (settings.requiredUrl && !values.url) {
        ctx.addIssue({
          code: "custom",
          message: "URL is required",
          path: ["url"],
        })
      }
      if (settings.requiredImage && !values.image) {
        ctx.addIssue({
          code: "custom",
          message: "An image is required",
          path: ["image"],
        })
      }
    })
}

export type StashItemFormValues = z.infer<
  ReturnType<typeof buildStashItemFormSchema>
>

export const defaultStashItemFormValues: StashItemFormValues = {
  title: "",
  url: "",
  description: "",
  tags: [],
  image: null,
}

/** The JSON "data" */
export const createStashItemPayloadSchema = z.object({
  title: z.string().trim().max(255).nullable(),
  url: z.string().trim().max(2048).nullable(),
  description: z.string().trim().max(500).nullable(),
  tags: z.array(z.string()).nullable(),
})

export type CreateStashItemPayload = z.infer<
  typeof createStashItemPayloadSchema
>

export function toStashItemPayload(
  values: StashItemFormValues,
): CreateStashItemPayload {
  return {
    title: values.title.trim() || null,
    url: values.url.trim() || null,
    description: values.description.trim() || null,
    tags: values.tags.length ? values.tags : null,
  }
}

export function toStashItemFormData(
  payload: CreateStashItemPayload,
  image: File | null,
): FormData {
  const formData = new FormData()
  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  )
  if (image) formData.append("image", image)
  return formData
}
