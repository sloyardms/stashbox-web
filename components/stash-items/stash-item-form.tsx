"use client"

import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { TagsCombobox } from "./tags-combobox"
import { StashItemImageField } from "./stash-item-image-field"
import { ApiError } from "@/lib/fetcher"
import { translateFieldError } from "@/lib/validations/field-error-messages"
import {
  buildStashItemFormSchema,
  defaultStashItemFormValues,
  toStashItemPayload,
  type StashItemFormValues,
  type CreateStashItemPayload,
} from "@/lib/validations/stash-items"
import type { ItemGroup, ItemGroupSettings } from "@/types/ItemGroup"

interface StashItemFormProps {
  group: ItemGroup
  settings: ItemGroupSettings
  onSubmit: (
    payload: CreateStashItemPayload,
    image: File | null,
  ) => Promise<void>
  submitLabel?: string
  formTitle?: string
  formDescription?: string
}

export function StashItemForm({
  group,
  settings,
  onSubmit,
  submitLabel = "Add item",
  formTitle = "New item",
  formDescription = `Add something to '${group.name}'.`,
}: StashItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rootError, setRootError] = useState<string | null>(null)
  const schema = useMemo(() => buildStashItemFormSchema(settings), [settings])

  const form = useForm<StashItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultStashItemFormValues,
    mode: "onBlur",
  })

  const title = form.watch("title")
  const description = form.watch("description")

  async function handleSubmit(values: StashItemFormValues) {
    setIsSubmitting(true)
    setRootError(null)

    // Ensure at least one of the fields is filled out
    const hasAny =
      values.title || values.url || values.description || values.image
    if (!hasAny) {
      setRootError(
        translateFieldError("validation.at_least_one_field_required"),
      )
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit(toStashItemPayload(values), values.image)
      form.reset(defaultStashItemFormValues)
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors?.length) {
        const knownFields = new Set(["title", "url", "description", "image"])
        const genericErrors = error.fieldErrors.filter(
          (fe) => fe.message === "validation.at_least_one_field_required",
        )

        if (genericErrors.length > 1) {
          setRootError(
            translateFieldError("validation.at_least_one_field_required"),
          )
        } else {
          let mappedAny = false
          for (const fieldError of error.fieldErrors) {
            if (knownFields.has(fieldError.field)) {
              form.setError(fieldError.field as keyof StashItemFormValues, {
                message: translateFieldError(fieldError.message),
              })
              mappedAny = true
            }
          }
          if (!mappedAny) toast.error("Something went wrong")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="border-border bg-card rounded-xl border shadow-sm">
        <div className="border-border border-b px-6 py-5">
          <h2 className="text-foreground text-lg font-semibold">{formTitle}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {formDescription}
          </p>
        </div>

        <div className="px-6 py-6">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="stash-item-title">
                      Title{settings.requiredTitle && " *"}
                    </FieldLabel>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {title.length}/255
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="stash-item-title"
                    maxLength={255}
                    aria-invalid={fieldState.invalid}
                    placeholder="Item title"
                    className="border-input"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stash-item-url">
                    URL{settings.requiredUrl && " *"}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="stash-item-url"
                    maxLength={2048}
                    aria-invalid={fieldState.invalid}
                    placeholder="https://…"
                    className="border-input"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="stash-item-description">
                      Description
                    </FieldLabel>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {description.length}/500
                    </span>
                  </div>
                  <Textarea
                    {...field}
                    id="stash-item-description"
                    maxLength={500}
                    aria-invalid={fieldState.invalid}
                    className="border-input min-h-20 resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => (
                <TagsCombobox
                  id="stash-item-tags"
                  groupSlug={group.slug}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stash-item-image">
                    Image{settings.requiredImage && " *"}
                  </FieldLabel>
                  <StashItemImageField
                    id="stash-item-image"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {rootError && <FieldError errors={[{ message: rootError }]} />}
          </FieldGroup>
        </div>

        <div className="border-border flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultStashItemFormValues)}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
