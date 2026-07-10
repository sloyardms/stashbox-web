import Link from "next/link"
import { PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <PackageX className="text-muted-foreground h-12 w-12" />
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Button render={<Link href="/">Go home</Link>} nativeButton={false} />
    </div>
  )
}