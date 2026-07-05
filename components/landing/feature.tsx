import { ReactNode } from "react"

export function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="bg-muted/40 flex items-center gap-2 rounded-lg border p-3">
      <div className="text-primary">{icon}</div>
      <span>{text}</span>
    </div>
  )
}
