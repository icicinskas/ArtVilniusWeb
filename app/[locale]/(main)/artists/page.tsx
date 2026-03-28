"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/routing"
import {
  ARTISTS,
  getArtistImage,
  getArtistLabel,
  getArtistYears,
} from "@/lib/artists"

type FilterMode = "all" | "az" | "time" | "favorites"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function ArtistsPage() {
  const tCommon = useTranslations("common")
  const t = useTranslations("artistsPage")
  const [activeFilter, setActiveFilter] = useState<FilterMode>("all")
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedStartYear, setSelectedStartYear] = useState<number | null>(null)
  const [selectedEndYear, setSelectedEndYear] = useState<number | null>(null)
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({})

  const availableLetters = useMemo(() => {
    const letters = new Set(
      ARTISTS.map((artist) => artist.lastName.charAt(0).toUpperCase())
    )
    return letters
  }, [])

  const availableYears = useMemo(() => {
    return getArtistYears()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const ids = ARTISTS.map((artist) => artist.id).join(",")
        const response = await fetch(
          `/api/favorites/summary?targetType=ARTIST&targetIds=${encodeURIComponent(ids)}`
        )

        if (!response.ok) {
          return
        }

        const data = await response.json()
        setFavoriteCounts(data.counts || {})
      } catch {
        // ignoruojame klaidas, kad nemestų filtro
      }
    }

    fetchFavorites()
  }, [])

  const displayedArtists = useMemo(() => {
    const base = [...ARTISTS]

    if (activeFilter === "favorites") {
      return base.sort((a, b) => {
        const aCount = favoriteCounts[a.id] ?? 0
        const bCount = favoriteCounts[b.id] ?? 0
        return bCount - aCount
      })
    }

    if (activeFilter === "az") {
      base.sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName, "lt")
        if (lastNameCompare !== 0) return lastNameCompare
        return a.firstName.localeCompare(b.firstName, "lt")
      })
      if (selectedLetter) {
        return base.filter((artist) =>
          artist.lastName.toUpperCase().startsWith(selectedLetter)
        )
      }
      return base
    }

    if (activeFilter === "time") {
      base.sort((a, b) => a.birthYear - b.birthYear)
      if (selectedStartYear !== null && selectedEndYear !== null) {
        const start = Math.min(selectedStartYear, selectedEndYear)
        const end = Math.max(selectedStartYear, selectedEndYear)
        return base.filter(
          (artist) => artist.birthYear >= start && artist.birthYear <= end
        )
      }
      return base
    }

    return base
  }, [
    activeFilter,
    selectedLetter,
    selectedStartYear,
    selectedEndYear,
    favoriteCounts,
  ])

  const handleFilterChange = (mode: FilterMode) => {
    setActiveFilter(mode)
    setSelectedLetter(null)
    setSelectedStartYear(null)
    setSelectedEndYear(null)
  }

  return (
    <div className="py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">{tCommon("artists")}</h1>

      <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-8 border-b border-border text-sm font-medium text-muted-foreground pb-2">
        {(["all", "az", "time", "favorites"] as FilterMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleFilterChange(mode)}
            className={`relative -mb-px px-3 pb-3 transition-colors ${
              activeFilter === mode
                ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                : "hover:text-foreground"
            }`}
          >
            {mode === "all" && t("all")}
            {mode === "az" && t("az")}
            {mode === "time" && t("time")}
            {mode === "favorites" && t("favorites")}
          </button>
        ))}
      </div>

      {activeFilter === "az" && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setSelectedLetter(null)}
            className={`rounded-full border px-3 py-1 transition ${
              selectedLetter === null
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("letterAll")}
          </button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ALPHABET.map((letter) => {
              const isAvailable = availableLetters.has(letter)
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedLetter(letter)}
                  className={`h-9 w-9 rounded-full border text-sm font-medium transition ${
                    selectedLetter === letter
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  } ${!isAvailable ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activeFilter === "time" && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedStartYear(null)
                setSelectedEndYear(null)
              }}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                selectedStartYear === null && selectedEndYear === null
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("timeAll")}
            </button>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <label htmlFor="time-from" className="font-medium">
                {t("from")}
              </label>
              <select
                id="time-from"
                value={selectedStartYear ?? ""}
                onChange={(event) =>
                  setSelectedStartYear(
                    event.target.value ? Number(event.target.value) : null
                  )
                }
                className="rounded-full border border-border bg-transparent px-3 py-1 text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("chooseYear")}</option>
                {availableYears.map((year) => (
                  <option key={`from-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label htmlFor="time-to" className="font-medium">
                {t("to")}
              </label>
              <select
                id="time-to"
                value={selectedEndYear ?? ""}
                onChange={(event) =>
                  setSelectedEndYear(
                    event.target.value ? Number(event.target.value) : null
                  )
                }
                className="rounded-full border border-border bg-transparent px-3 py-1 text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">{t("chooseYear")}</option>
                {availableYears.map((year) => (
                  <option key={`to-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {displayedArtists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.id}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
          >
            <Image
              src={getArtistImage(artist)}
              alt={getArtistLabel(artist)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={artist.id === ARTISTS[0].id}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white">
              <p className="text-sm font-semibold leading-tight">
                {getArtistLabel(artist)}
              </p>
              <p className="text-xs text-white/80">
                {artist.artworksCount} {t("items")}
              </p>
              <p className="text-xs text-white/70">
                {t("born")} {artist.birthYear}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {displayedArtists.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          {t("noResults")}
        </div>
      )}
    </div>
  )
}
