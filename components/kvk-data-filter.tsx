"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLanguage } from "./language-provider"

interface KvKDataFilterProps {
  onDataTypeChange: (value: string) => void
  onSearch: (value: string) => void
}

export function KvKDataFilter({ onDataTypeChange, onSearch }: KvKDataFilterProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("dataStart")
  const { t } = useLanguage()

  const dataTypes = [
    {
      value: "dataStart",
      label: String(t("dataStart")),
    },
    {
      value: "dataPass4",
      label: String(t("dataPass4")),
    },
    {
      value: "dataPass7",
      label: String(t("dataPass7")),
    },
    {
      value: "dataKingland",
      label: String(t("dataKingland")),
    },
  ]

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? dataTypes.find((type) => type.value === value)?.label
              : String(t("dataStart"))}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup>
              {dataTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    onDataTypeChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        type="search"
        placeholder={String(t("searchById"))}
        className="w-[200px]"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
} 