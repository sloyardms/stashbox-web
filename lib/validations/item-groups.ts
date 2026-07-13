import { z } from "zod"

export const itemGroupSettingsSchema = z
  .object({
    requiredTitle: z.boolean(),
    uniqueTitle: z.boolean(),
    requiredUrl: z.boolean(),
    uniqueUrl: z.boolean(),
    requiredImage: z.boolean(),
  })
  .superRefine((settings, ctx) => {
    if (settings.uniqueTitle && !settings.requiredTitle) {
      ctx.addIssue({
        code: "custom",
        message: 'Requires "Require a title" to be enabled',
        path: ["uniqueTitle"],
      })
    }
    if (settings.uniqueUrl && !settings.requiredUrl) {
      ctx.addIssue({
        code: "custom",
        message: 'Requires "Require a URL" to be enabled',
        path: ["uniqueUrl"],
      })
    }
  })

export const itemGroupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(75, "Max 75 characters"),
  description: z.string().trim().max(255, "Max 255 characters"),
  icon: z.string().trim().max(50, "Max 50 characters"),
  settings: itemGroupSettingsSchema,
})

export type ItemGroupFormValues = z.infer<typeof itemGroupFormSchema>

export const defaultItemGroupFormValues: ItemGroupFormValues = {
  name: "",
  description: "",
  icon: "",
  settings: {
    requiredTitle: false,
    uniqueTitle: false,
    requiredUrl: false,
    uniqueUrl: false,
    requiredImage: false,
  },
}

export const createItemGroupPayloadSchema = z.object({
  name: z.string().trim().min(1).max(75),
  description: z.string().trim().max(255).nullable(),
  icon: z.string().trim().max(50).nullable(),
  settings: itemGroupSettingsSchema,
})

export type CreateItemGroupPayload = z.infer<
  typeof createItemGroupPayloadSchema
>

export function toItemGroupPayload (
  values: ItemGroupFormValues,
): CreateItemGroupPayload {
  return {
    name: values.name,
    description: values.description.trim() || null,
    icon: values.icon.trim() || null,
    settings: values.settings,
  }
}
