"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface GallerySearchProps {
  onSearch?: (query: string) => void
  className?: string
  placeholder?: string
}

export function GallerySearch({
  onSearch,
  className,
  placeholder,
}: GallerySearchProps) {
  const t = useTranslations("gallery")
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = React.useState(
    searchParams.get("search") || ""
  )

  const handleSearch = (value: string) => {
    setQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
    onSearch?.(value)
  }

  const clearSearch = () => {
    handleSearch("")
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder || t("searchPlaceholder")}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
