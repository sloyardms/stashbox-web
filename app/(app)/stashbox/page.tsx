"use client"

import { useStashboxStore } from "@/lib/stashbox-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StashboxPage() {
  const router = useRouter()
  const selectedGroup = useStashboxStore((s) => s.selectedGroup)

  useEffect(() => {
    if (selectedGroup) {
      router.replace(`/stashbox/groups/${selectedGroup.id}`)
    }
  }, [selectedGroup, router])

  return null
}
