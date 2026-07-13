"use client"

import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { ItemGroupForm } from "@/components/item-groups/item-group-form"
import { useItemGroup } from "@/hooks/item-groups/useItemGroup"
import { useUpdateItemGroup } from "@/hooks/item-groups/useUpdateItemGroup"
import { routes } from "@/lib/routes"
import type { ItemGroupFormValues } from "@/lib/validations/item-groups"
import { BackLink } from "@/components/ui/back-link"

export default function EditItemGroupPage() {
  const router = useRouter()
  const { group } = useParams<{ group: string }>()
  const { itemGroup, isLoading, isNotFound } = useItemGroup(group)
  const { updateItemGroup } = useUpdateItemGroup()

  async function handleSubmit(values: ItemGroupFormValues) {
    if (!itemGroup) return
    const updated = await updateItemGroup(itemGroup.slug, values)
    toast.success("Group updated", {
      description: `"${updated.name}" has been updated.`,
    })
    router.push(routes.groups.collection(updated.slug))
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-10 text-center text-sm">
        Loading…
      </div>
    )
  }

  if (isNotFound || !itemGroup) {
    return (
      <div className="text-muted-foreground p-10 text-center text-sm">
        Group not found.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <BackLink href={routes.groups.collection(group)}>Back to {itemGroup.name}</BackLink>

      <ItemGroupForm
        key={itemGroup.id}
        formTitle="Edit group"
        formDescription={`Editing "${itemGroup.name}"`}
        submitLabel="Save changes"
        defaultValues={{
          name: itemGroup.name,
          description: itemGroup.description ?? "",
          icon: itemGroup.icon ?? "",
          settings: itemGroup.settings,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
