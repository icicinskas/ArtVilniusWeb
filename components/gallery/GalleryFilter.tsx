"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

interface FilterOptions {
  category?: string
  technique?: string
  minPrice?: string
  maxPrice?: string
  year?: string
  search?: string
}

interface GalleryFilterProps {
  categories?: string[]
  techniques?: string[]
  onFilterChange?: (filters: FilterOptions) => void
  className?: string
}

export function GalleryFilter({
  categories = [],
  techniques = [],
  onFilterChange,
  className,
}: GalleryFilterProps) {
  const t = useTranslations("gallery")
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = React.useState<FilterOptions>({
    category: searchParams.get("category") || "",
    technique: searchParams.get("technique") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    year: searchParams.get("year") || "",
    search: searchParams.get("search") || "",
  })

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    
    const params = new URLSearchParams()
    Object.entries(updated).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    
    router.push(`?${params.toString()}`)
    onFilterChange?.(updated)
  }

  const clearFilters = () => {
    setFilters({})
    router.push("?")
    onFilterChange?.({})
  }

  const hasActiveFilters = Object.values(filters).some((v) => v)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("filters")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("clear")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("search")}</Label>
          <Input
            placeholder={t("searchPlaceholder")}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {categories.length > 0 && (
          <div className="space-y-2">
            <Label>{t("category")}</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {techniques.length > 0 && (
          <div className="space-y-2">
            <Label>{t("technique")}</Label>
            <Select
              value={filters.technique}
              onValueChange={(value) => updateFilters({ technique: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allTechniques")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allTechniques")}</SelectItem>
                {techniques.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>{t("minPrice")}</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("maxPrice")}</Label>
            <Input
              type="number"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("year")}</Label>
          <Input
            type="number"
            placeholder={t("yearPlaceholder")}
            value={filters.year}
            onChange={(e) => updateFilters({ year: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
