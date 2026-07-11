"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { ItemGroupForm } from "@/components/item-groups/item-group-form"
import { useCreateItemGroup } from "@/hooks/item-groups/useCreateItemGroup"
import type { ItemGroupFormValues } from "@/lib/validations/item-groups"
import Link from "next/link"
import { routes } from "@/lib/routes"
import { ArrowLeft } from "lucide-react"

export default function NewItemGroupPage() {
  const router = useRouter()
  const { createItemGroup } = useCreateItemGroup()

  const returnSlug = useSearchParams().get("from")

  async function handleSubmit(values: ItemGroupFormValues) {
    await createItemGroup(values)
    router.push(returnSlug ? `/stashbox/groups/${returnSlug}` : "/stashbox")
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {returnSlug && (
        <Link
          href={routes.groups.details(returnSlug)}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to {returnSlug}
        </Link>
      )}
      <ItemGroupForm onSubmit={handleSubmit} />
    </div>
  )
}
