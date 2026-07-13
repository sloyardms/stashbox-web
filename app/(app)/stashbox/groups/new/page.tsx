"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { ItemGroupForm } from "@/components/item-groups/item-group-form"
import { useCreateItemGroup } from "@/hooks/item-groups/useCreateItemGroup"
import type { ItemGroupFormValues } from "@/lib/validations/item-groups"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { routes } from "@/lib/routes"
import { toast } from "sonner"
import { BackLink } from "@/components/ui/back-link"

export default function NewItemGroupPage() {
  const router = useRouter()
  const { createItemGroup } = useCreateItemGroup()

  const returnSlug = useSearchParams().get("from")

  async function handleSubmit(values: ItemGroupFormValues) {
    await createItemGroup(values)
    toast.success(`Created "${values.name}".`)
    router.push(returnSlug ? `/stashbox/groups/${returnSlug}` : "/stashbox")
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {returnSlug && (
        <BackLink href={routes.groups.collection(returnSlug)}>
          Back to {returnSlug}
        </BackLink>
      )}
      <ItemGroupForm onSubmit={handleSubmit} />
    </div>
  )
}
