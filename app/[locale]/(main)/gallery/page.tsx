"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/routing"
import {
  getExhibitionsByYear,
  getAvailableExhibitionYears,
} from "@/lib/exhibitions"
import type { Exhibition } from "@/lib/exhibitions"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin, ArrowRight, Images } from "lucide-react"
import { format } from "date-fns"
import { lt } from "date-fns/locale"

function ExhibitionCard({
  exhibition,
  learnMore,
}: {
  exhibition: Exhibition
  learnMore: string
}) {
  const isSameDay =
    !exhibition.endDate ||
    exhibition.startDate.getTime() === exhibition.endDate.getTime()

  const dateText = isSameDay
    ? format(exhibition.startDate, "yyyy-MM-dd", { locale: lt })
    : `${format(exhibition.startDate, "yyyy-MM-dd", { locale: lt })} – ${format(exhibition.endDate!, "yyyy-MM-dd", { locale: lt })}`

  const content = (
    <Card className="group overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      {exhibition.imageUrl ? (
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={exhibition.imageUrl}
            alt={exhibition.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
          <Images className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}
      <CardHeader>
        <h3 className="font-semibold text-lg line-clamp-2">{exhibition.title}</h3>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {exhibition.description && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {exhibition.description}
          </p>
        )}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{dateText}</span>
          </div>
          {exhibition.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{exhibition.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      {exhibition.href && (
        <CardFooter className="pt-0">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
            <span>{learnMore}</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        </CardFooter>
      )}
    </Card>
  )

  if (exhibition.href) {
    return (
      <Link href={exhibition.href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}

export default function GalleryPage() {
  const tCommon = useTranslations("common")
  const t = useTranslations("galleryPage")
  const searchParams = useSearchParams()

  const availableYears = getAvailableExhibitionYears()
  const yearParam = searchParams.get("year")
  const selectedYear = yearParam
    ? parseInt(yearParam, 10)
    : availableYears[0] ?? new Date().getFullYear()

  const isValidYear = availableYears.includes(selectedYear)
  const displayYear = isValidYear ? selectedYear : availableYears[0]
  const displayedExhibitions = displayYear
    ? getExhibitionsByYear(displayYear)
    : []

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{tCommon("gallery")}</h1>
        <p className="text-base sm:text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <aside className="lg:w-48 shrink-0 order-2 lg:order-1">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t("viewByYear")}
          </h2>
          <nav className="flex flex-col gap-1">
            {availableYears.map((year) => (
              <Link
                key={year}
                href={`/gallery?year=${year}`}
                className={`
                  py-2 px-3 rounded-md text-left transition-colors
                  ${
                    year === displayYear
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {year}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 order-1 lg:order-2">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {displayYear ?? new Date().getFullYear()}
          </h2>

          {displayedExhibitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedExhibitions.map((exhibition) => (
                <ExhibitionCard
                  key={exhibition.id}
                  exhibition={exhibition}
                  learnMore={t("learnMore")}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              {t("noExhibitions")}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
