"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/lib/routing"
import { MOVEMENTS, MovementEra } from "@/lib/movements"

type EraKey = "all" | MovementEra

type SortOption = "chron-asc" | "chron-desc" | "impact-desc"

export default function MovementsPage() {
  const t = useTranslations("common")
  const tMov = useTranslations("movements")
  const [query, setQuery] = useState("")
  const [era, setEra] = useState<EraKey>("all")
  const [sort, setSort] = useState<SortOption>("chron-asc")
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards")

  const eraOptions: Array<{ value: EraKey; label: string }> = [
    { value: "all", label: tMov("era.all") },
    { value: "pre19", label: tMov("era.pre19") },
    { value: "19", label: tMov("era.19") },
    { value: "20", label: tMov("era.20") },
    { value: "contemporary", label: tMov("era.contemporary") },
  ]

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "chron-asc", label: tMov("sort.chronAsc") },
    { value: "chron-desc", label: tMov("sort.chronDesc") },
    { value: "impact-desc", label: tMov("sort.impactDesc") },
  ]

  const getMovementText = (movementId: string) => {
    const baseKey = `items.${movementId}`
    const asArray = (key: string) => {
      const value = tMov.raw(key)
      return Array.isArray(value) ? value : []
    }

    return {
      title: tMov(`${baseKey}.title`),
      period: tMov(`${baseKey}.period`),
      summary: tMov(`${baseKey}.summary`),
      region: tMov(`${baseKey}.region`),
      keyIdeas: asArray(`${baseKey}.keyIdeas`),
      keyArtists: asArray(`${baseKey}.keyArtists`),
      focus: asArray(`${baseKey}.focus`),
      tags: asArray(`${baseKey}.tags`),
    }
  }

  const filteredMovements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = MOVEMENTS.filter((movement) => {
      const matchesEra = era === "all" || movement.era === era
      if (!matchesEra) return false
      if (!normalizedQuery) return true
      const movementText = getMovementText(movement.id)
      const haystack = [
        movementText.title,
        movementText.summary,
        movementText.period,
        movementText.region,
        ...movementText.keyIdeas,
        ...movementText.keyArtists,
        ...movementText.tags,
        ...movementText.focus,
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })

    return filtered.sort((a, b) => {
      if (sort === "impact-desc") {
        return b.impactScore - a.impactScore
      }
      if (sort === "chron-desc") {
        return b.startYear - a.startYear
      }
      return a.startYear - b.startYear
    })
  }, [era, query, sort])

  return (
    <div className="container px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-muted/40 p-8 shadow-sm">
        <div className="absolute inset-0 bg-[url('/images/frontend/artMovements.jpg')] bg-cover bg-center opacity-65" />
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <p className="text-sm font-medium text-foreground">
            {tMov("heroBadge")}
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            {t("artMovements")}
          </h1>
          <p className="text-muted-foreground">
            {tMov("heroDescription")}
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">{tMov("heroTags.directions")}</Badge>
            <Badge variant="outline">{tMov("heroTags.ideas")}</Badge>
            <Badge variant="outline">{tMov("heroTags.artists")}</Badge>
            <Badge variant="outline">{tMov("heroTags.periods")}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <label className="text-sm font-medium">{tMov("searchLabel")}</label>
          <Input
            placeholder={tMov("searchPlaceholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium">{tMov("sortLabel")}</label>
          <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger>
              <SelectValue placeholder={tMov("sortPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{tMov("periodLabel")}</span>
          {eraOptions.map((option) => (
            <Button
              key={option.value}
              variant={era === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setEra(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{tMov("viewLabel")}</span>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            {tMov("view.cards")}
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
          >
            {tMov("view.timeline")}
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {tMov("resultsCount", { count: filteredMovements.length })}
        </p>
        {(query || era !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("")
              setEra("all")
            }}
          >
            {tMov("clearFilters")}
          </Button>
        )}
      </div>

      {filteredMovements.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {tMov("noResults")}
        </div>
      ) : viewMode === "timeline" ? (
        <div className="mt-8 space-y-6 border-l-2 border-muted pl-6">
          {filteredMovements.map((movement) => {
            const movementText = getMovementText(movement.id)
            return (
              <div key={movement.id} className="relative">
              <div className="absolute -left-[13px] top-2 h-4 w-4 rounded-full border bg-background" />
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-xl">{movementText.title}</CardTitle>
                    <Badge variant="secondary">{movementText.period}</Badge>
                  </div>
                  <CardDescription>{movementText.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">
                      {tMov("labels.region")}
                    </span>{" "}
                    {movementText.region}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movementText.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary">
                    <Link href={`/movements/${movement.id}`}>
                      {tMov("cta.learnMore")}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMovements.map((movement) => {
            const movementText = getMovementText(movement.id)
            return (
              <Card
                key={movement.id}
                className="relative flex h-full flex-col overflow-hidden"
              >
                {movement.image && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-65"
                      style={{ backgroundImage: `url(${movement.image})` }}
                    />
                    <div className="absolute inset-0 bg-background/55" />
                  </>
                )}
                <CardHeader className="relative z-10 space-y-3 text-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{movementText.period}</Badge>
                  </div>
                  <CardTitle className="text-xl">{movementText.title}</CardTitle>
                  <CardDescription className="text-foreground/90">
                    {movementText.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">
                      {tMov("labels.region")}
                    </span>{" "}
                    {movementText.region}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {tMov("labels.keyIdeas")}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {movementText.keyIdeas.map((idea) => (
                        <Badge key={idea} variant="outline">
                          {idea}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="relative z-10 mt-auto">
                  <Button asChild variant="secondary">
                    <Link href={`/movements/${movement.id}`}>
                      {tMov("cta.learnMore")}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
