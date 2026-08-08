"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import {
  itemGroupFormSchema,
  defaultItemGroupFormValues,
  type ItemGroupFormValues,
} from "@/lib/item-groups/validations"
import { IconPicker } from "../icon-picker/icon-picker"
import { ApiError } from "@/lib/fetcher"
import { translateFieldError } from "@/lib/validations/field-error-messages"
import { toast } from "sonner"

interface ItemGroupFormProps {
  defaultValues?: ItemGroupFormValues
  onSubmit: (values: ItemGroupFormValues) => Promise<void>
  submitLabel?: string
  formTitle?: string
  formDescription?: string
}

export function ItemGroupForm({
  defaultValues = defaultItemGroupFormValues,
  onSubmit,
  submitLabel = "Create group",
  formTitle = "New group",
  formDescription = "Groups organize your items and control what fields they require.",
}: ItemGroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rootError, setRootError] = useState<string | null>(null)

  const form = useForm<ItemGroupFormValues>({
    resolver: zodResolver(itemGroupFormSchema),
    defaultValues,
    mode: "onBlur",
  })

  const name = form.watch("name")
  const description = form.watch("description")
  const requiredTitle = form.watch("settings.requiredTitle")
  const requiredUrl = form.watch("settings.requiredUrl")

  function toggleRequiredTitle(checked: boolean) {
    form.setValue("settings.requiredTitle", checked)
    if (!checked) form.setValue("settings.uniqueTitle", false)
  }

  function toggleRequiredUrl(checked: boolean) {
    form.setValue("settings.requiredUrl", checked)
    if (!checked) form.setValue("settings.uniqueUrl", false)
  }

  async function handleSubmit(values: ItemGroupFormValues) {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors?.length) {
        const knownFields = new Set(["name", "description", "icon"])
        let mappedAny = false

        for (const fieldError of error.fieldErrors) {
          if (knownFields.has(fieldError.field)) {
            form.setError(fieldError.field as keyof ItemGroupFormValues, {
              message: translateFieldError(fieldError.message),
            })
            mappedAny = true
          }
        }

        if (mappedAny) return
      }

      //Other errors
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="border-border bg-card rounded-xl border shadow-sm">
        <div className="border-border border-b px-6 py-5">
          <h1 className="text-foreground text-lg font-semibold">{formTitle}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {formDescription}
          </p>
        </div>

        <div className="px-6 py-6">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-baseline justify-between">
                    <FieldLabel htmlFor="item-group-name">Name</FieldLabel>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {name.length}/75
                    </span>
                  </div>
                  <Input
                    {...field}
                    id="item-group-name"
                    maxLength={75}
                    aria-invalid={fieldState.invalid}
                    placeholder="Board games"
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
                    <FieldLabel htmlFor="item-group-description">
                      Description
                    </FieldLabel>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {description.length}/255
                    </span>
                  </div>
                  <Textarea
                    {...field}
                    id="item-group-description"
                    maxLength={255}
                    aria-invalid={fieldState.invalid}
                    placeholder="What kind of items live here"
                    className="border-input min-h-20 resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="item-group-icon">Icon</FieldLabel>
                  <IconPicker
                    id="item-group-icon"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldSet className="border-border bg-muted/30 rounded-lg border p-4">
              <FieldLegend
                variant="label"
                className="bg-muted/30 -mt-6 mb-2 -ml-1 w-fit px-1"
              >
                Item settings
              </FieldLegend>
              <FieldDescription className="mb-3">
                Choose what items in this group are required to have.
              </FieldDescription>

              <div className="space-y-1">
                <Controller
                  name="settings.requiredTitle"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal" className="py-2">
                      <FieldLabel
                        htmlFor="settings-requiredTitle"
                        className="font-normal"
                      >
                        Require a title on items
                      </FieldLabel>
                      <Switch
                        id="settings-requiredTitle"
                        checked={field.value}
                        onCheckedChange={toggleRequiredTitle}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="settings.uniqueTitle"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className="border-border border-l-2 py-2 pl-4"
                    >
                      <FieldLabel
                        htmlFor="settings-uniqueTitle"
                        className={
                          requiredTitle
                            ? "font-normal"
                            : "text-muted-foreground font-normal"
                        }
                      >
                        Titles must be unique
                      </FieldLabel>
                      <Switch
                        id="settings-uniqueTitle"
                        checked={field.value}
                        disabled={!requiredTitle}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="settings.requiredUrl"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal" className="py-2">
                      <FieldLabel
                        htmlFor="settings-requiredUrl"
                        className="font-normal"
                      >
                        Require a URL on items
                      </FieldLabel>
                      <Switch
                        id="settings-requiredUrl"
                        checked={field.value}
                        onCheckedChange={toggleRequiredUrl}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="settings.uniqueUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className="border-border border-l-2 py-2 pl-4"
                    >
                      <FieldLabel
                        htmlFor="settings-uniqueUrl"
                        className={
                          requiredUrl
                            ? "font-normal"
                            : "text-muted-foreground font-normal"
                        }
                      >
                        URLs must be unique
                      </FieldLabel>
                      <Switch
                        id="settings-uniqueUrl"
                        checked={field.value}
                        disabled={!requiredUrl}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="settings.requiredImage"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal" className="py-2">
                      <FieldLabel
                        htmlFor="settings-requiredImage"
                        className="font-normal"
                      >
                        Require an image on items
                      </FieldLabel>
                      <Switch
                        id="settings-requiredImage"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </div>
            </FieldSet>

            {rootError && <FieldError errors={[{ message: rootError }]} />}
          </FieldGroup>
        </div>

        <div className="border-border flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
