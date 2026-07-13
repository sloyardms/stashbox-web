import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BackLinkProps {
  href: string
  children: React.ReactNode
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
    >
      <ArrowLeft className="size-4" />
      {children}
    </Link>
  )
}
