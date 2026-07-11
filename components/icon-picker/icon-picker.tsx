"use client"

//https://modall.ca/lab/shadcn-icon-picker-component

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useIconPicker } from "@/hooks/useIconPicker"
import { IconRenderer } from "./icon-renderer"

interface IconPickerProps {
  value?: string
  onChange: (icon: string | undefined) => void
  id?: string
}

export function IconPicker({ value, onChange, id }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const { search, setSearch, icons } = useIconPicker()

  return (
    <div className="flex w-full items-center gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="border-input min-w-0 flex-1 justify-start gap-2 font-normal"
            >
              {value ? (
                <>
                  <IconRenderer icon={value} className="size-4 shrink-0" />
                  <span className="truncate">
                    {value.match(/[A-Z][a-z0-9]*/g)?.join(" ") ?? value}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Select an icon</span>
              )}
            </Button>
          }
        ></PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search icons"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No icons found.</CommandEmpty>
              <CommandGroup>
                {!search && (
                  <CommandItem
                    value="__none"
                    onSelect={() => {
                      onChange(undefined)
                      setOpen(false)
                    }}
                    className="text-muted-foreground mb-1 gap-2"
                  >
                    <X className="size-4" />
                    No icon
                  </CommandItem>
                )}
                <div className="grid grid-cols-6 gap-1 p-2">
                  {icons.map(({ name, friendlyName, Icon }) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        onChange(name)
                        setOpen(false)
                      }}
                      className="data-[selected=true]:bg-accent flex aspect-square items-center justify-center rounded-md p-0"
                      title={friendlyName}
                    >
                      <Icon className="size-4" />
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => onChange(undefined)}
          aria-label="Clear icon"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
