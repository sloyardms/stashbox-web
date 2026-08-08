"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebouncedValue } from "@/hooks/shared/useDebouncedValue"
import { useTagSearch } from "@/hooks/tags/useTagSearch"

interface TagsComboboxProps {
  id?: string
  groupSlug: string
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagsCombobox({
  id,
  groupSlug,
  value,
  onChange,
}: TagsComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 250)
  const { tags, isLoading } = useTagSearch(groupSlug, debouncedSearch)

  const trimmedSearch = search.trim()
  const availableTags = tags.filter((tag) => !value.includes(tag.name))
  const exactMatch = tags.some(
    (tag) => tag.name.toLowerCase() === trimmedSearch.toLowerCase(),
  )
  const canCreate =
    trimmedSearch.length > 0 && !exactMatch && !value.includes(trimmedSearch)

  function addTag(name: string) {
    if (!value.includes(name)) onChange([...value, name])
    setSearch("")
  }

  function removeTag(name: string) {
    onChange(value.filter((t) => t !== name))
  }

  return (
    <div className="flex flex-col gap-1.5">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              id={id}
              type="button"
              role="combobox"
              aria-expanded={open}
              className="border-input text-muted-foreground hover:bg-muted flex h-8 items-center rounded-md border px-2.5 text-left text-sm"
            >
              Search or add a tag…
            </button>
          }
        />
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search tags"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isLoading ? (
                <div className="text-muted-foreground p-3 text-center text-sm">
                  Searching…
                </div>
              ) : (
                <>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => addTag(tag.name)}
                      >
                        <span className="flex-1 truncate">{tag.name}</span>
                        <span className="text-muted-foreground text-xs tabular-nums">
                          {tag.itemCount}
                        </span>
                      </CommandItem>
                    ))}
                    {canCreate && (
                      <CommandItem
                        value={`__create_${trimmedSearch}`}
                        onSelect={() => addTag(trimmedSearch)}
                      >
                        Create “{trimmedSearch}”
                      </CommandItem>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
