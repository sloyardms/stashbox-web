//https://modall.ca/lab/shadcn-icon-picker-component

import { itemGroupIcons } from "@/lib/item-groups/item-group-icons"
import type { LucideProps } from "lucide-react"

interface IconRendererProps extends LucideProps {
  icon: string
}

export function IconRenderer({
  icon,
  fallback = "Folder",
  ...props
}: IconRendererProps & { fallback?: string }) {
  const Icon = itemGroupIcons[icon] ?? itemGroupIcons[fallback]
  if (!Icon) return null
  return <Icon {...props} />
}
