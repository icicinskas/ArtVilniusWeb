"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Flame, Clock, Palette, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Artwork } from "@/lib/artists"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/routing"

type WorksFilter = "popularity" | "time" | "color" | "favorites"

const COLOR_PALETTE = [
  { id: "green", label: "Green", value: "#1f7a3a" },
  { id: "blue", label: "Blue", value: "#2d6cdf" },
  { id: "red", label: "Red", value: "#d64545" },
  { id: "yellow", label: "Yellow", value: "#e0b422" },
  { id: "purple", label: "Purple", value: "#6a3aa8" },
  { id: "orange", label: "Orange", value: "#e07a22" },
  { id: "black", label: "Black", value: "#2b2b2b" },
  { id: "white", label: "White", value: "#d7d7d7" },
  { id: "gray", label: "Gray", value: "#9b9b9b" },
  { id: "brown", label: "Brown", value: "#7a5230" },
  { id: "gold", label: "Gold", value: "#c7a23a" },
  { id: "beige", label: "Beige", value: "#d7c1a0" },
]

const buildTimeRanges = (artworks: Artwork[], step = 5) => {
  const years = artworks.map((work) => work.year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const startYear = Math.floor(minYear / step) * step
  const endYear = Math.floor(maxYear / step) * step
  const ranges = []

  for (let year = startYear; year <= endYear; year += step) {
    ranges.push({
      id: `${year}-${year + step - 1}`,
      start: year,
      end: year + step - 1,
      label: `${year}`,
    })
  }

  return ranges
}

interface ArtistWorksProps {
  artistId: string
  artworks: Artwork[]
}

export function ArtistWorks({ artistId, artworks }: ArtistWorksProps) {
  const t = useTranslations("artistsDetail")
  const [activeFilter, setActiveFilter] = useState<WorksFilter>("popularity")
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].id)
  const [pageIndex, setPageIndex] = useState(0)
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({})
  const itemsPerPage = 12

  const timeRanges = useMemo(
    () => buildTimeRanges(artworks),
    [artworks]
  )

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const ids = artworks.map((work) => work.id).join(",")
        const response = await fetch(
          `/api/favorites/summary?targetType=ARTWORK&targetIds=${encodeURIComponent(ids)}`
        )

        if (!response.ok) {
          return
        }

        const data = await response.json()
        setFavoriteCounts(data.counts || {})
      } catch {
        // ignoruojame klaidas, kad nekristų filtravimas
      }
    }

    if (artworks.length > 0) {
      fetchFavorites()
    }
  }, [artworks])

  const filteredArtworks = useMemo(() => {
    if (activeFilter === "popularity") {
      return [...artworks].sort((a, b) => b.popularity - a.popularity)
    }

    if (activeFilter === "time") {
      const range = timeRanges[selectedRangeIndex]
      if (!range) return artworks
      return artworks.filter(
        (work) => work.year >= range.start && work.year <= range.end
      )
    }

    if (activeFilter === "color") {
      return artworks.filter((work) => work.dominantColor === selectedColor)
    }

    if (activeFilter === "favorites") {
      return [...artworks].sort((a, b) => {
        const aCount = favoriteCounts[a.id] ?? 0
        const bCount = favoriteCounts[b.id] ?? 0
        return bCount - aCount
      })
    }

    return artworks
  }, [
    activeFilter,
    artworks,
    selectedRangeIndex,
    selectedColor,
    timeRanges,
    favoriteCounts,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArtworks.length / itemsPerPage)
  )
  const safePageIndex = Math.min(pageIndex, totalPages - 1)
  const pageItems = filteredArtworks.slice(
    safePageIndex * itemsPerPage,
    safePageIndex * itemsPerPage + itemsPerPage
  )

  const handleFilterChange = (mode: WorksFilter) => {
    setActiveFilter(mode)
    setPageIndex(0)
  }

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % totalPages)
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {t("itemsCount", { count: artworks.length })}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{t("organizeBy")}</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleFilterChange("popularity")}
              className={cn(
                "flex items-center gap-2 text-muted-foreground transition",
                activeFilter === "popularity" && "text-foreground"
              )}
            >
              <Flame className="h-5 w-5" />
              {t("popular")}
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("favorites")}
              className={cn(
                "flex items-center gap-2 text-muted-foreground transition",
                activeFilter === "favorites" && "text-foreground"
              )}
            >
              <Heart className="h-5 w-5" />
              {t("favorites")}
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("time")}
              className={cn(
                "flex items-center gap-2 text-muted-foreground transition",
                activeFilter === "time" && "text-foreground"
              )}
            >
              <Clock className="h-5 w-5" />
              {t("time")}
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("color")}
              className={cn(
                "flex items-center gap-2 text-muted-foreground transition",
                activeFilter === "color" && "text-foreground"
              )}
            >
              <Palette className="h-5 w-5" />
              {t("color")}
            </button>
          </div>
        </div>
      </div>

      {activeFilter === "time" && timeRanges.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {timeRanges.map((range, index) => (
              <div key={range.id} className="flex items-center gap-3">
                <span className={index === selectedRangeIndex ? "text-foreground" : ""}>
                  {range.label}
                </span>
                {index < timeRanges.length - 1 && (
                  <span className="h-2 w-2 rounded-full bg-border" />
                )}
              </div>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={timeRanges.length - 1}
            value={selectedRangeIndex}
            onChange={(event) => setSelectedRangeIndex(Number(event.target.value))}
            className="mt-3 h-2 w-full cursor-pointer accent-primary"
          />
        </div>
      )}

      {activeFilter === "color" && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColor(color.id)}
                className={cn(
                  "h-8 w-8 rounded-md border transition",
                  selectedColor === color.id
                    ? "border-foreground"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
                aria-label={color.label}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative mt-6">
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow-sm"
          aria-label={t("prev")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow-sm"
          aria-label={t("next")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((work) => (
            <Link
              key={work.id}
              href={`/artists/${artistId}/artworks/${work.id}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
              aria-label={work.title}
            >
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
                <p className="font-semibold">{work.title}</p>
                <p className="text-white/80">{work.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {filteredArtworks.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">{t("noWorks")}</p>
      )}
    </div>
  )
}
