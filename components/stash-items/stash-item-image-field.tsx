"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, Link as LinkIcon, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StashItemImageFieldProps {
  id?: string
  value: File | null
  onChange: (file: File | null) => void
  invalid?: boolean
}

export function StashItemImageField({ id, value, onChange, invalid }: StashItemImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isFetchingUrl, setIsFetchingUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  async function handleFetchFromUrl() {
    const trimmed = imageUrl.trim()
    if (!trimmed) return

    setIsFetchingUrl(true)
    try {
      const res = await fetch(trimmed)
      if (!res.ok) throw new Error("Request failed")

      const blob = await res.blob()
      if (!blob.type.startsWith("image/")) throw new Error("Not an image")

      const filename = trimmed.split("/").pop()?.split("?")[0] || "image"
      onChange(new File([blob], filename, { type: blob.type }))
      setUrlDialogOpen(false)
      setImageUrl("")
    } catch {
      toast.error(
        "Couldn't load that image — the site may block direct access. Try downloading and uploading it instead.",
      )
    } finally {
      setIsFetchingUrl(false)
    }
  }

  return (
    <div className="flex items-start gap-3">
      {previewUrl ? (
        <div className="border-border group relative size-20 shrink-0 overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element -- transient blob: URL, not a static asset */}
          <img src={previewUrl} alt="" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="bg-background/80 absolute top-0.5 right-0.5 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                id={id}
                type="button"
                aria-invalid={invalid}
                className="border-input text-muted-foreground hover:bg-muted flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs"
              >
                <ImagePlus className="size-5" />
                Add
              </button>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Upload a file
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUrlDialogOpen(true)}>
              <LinkIcon className="size-4" />
              From a URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />

      <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add image from URL</DialogTitle>
          </DialogHeader>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={isFetchingUrl}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUrlDialogOpen(false)} disabled={isFetchingUrl}>
              Cancel
            </Button>
            <Button type="button" onClick={handleFetchFromUrl} disabled={isFetchingUrl}>
              {isFetchingUrl ? "Loading…" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}