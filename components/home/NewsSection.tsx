"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/routing"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { lt } from "date-fns/locale"
import { upcomingEvents } from "@/lib/upcoming-events"
import type { UpcomingEvent } from "@/lib/upcoming-events"

function EventCard({ event, learnMore }: { event: UpcomingEvent; learnMore: string }) {
  const isSameDay =
    !event.endDate ||
    event.startDate.getTime() === event.endDate.getTime()

  const dateText = isSameDay
    ? format(event.startDate, "yyyy-MM-dd", { locale: lt })
    : `${format(event.startDate, "yyyy-MM-dd", { locale: lt })} – ${format(event.endDate!, "yyyy-MM-dd", { locale: lt })}`

  const content = (
    <Card className="group overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      {event.imageUrl ? (
        <div className="relative h-40 overflow-hidden bg-muted">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}
      <CardHeader>
        <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {event.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{dateText}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      {event.href && (
        <CardFooter className="pt-0">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
            <span>{learnMore}</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        </CardFooter>
      )}
    </Card>
  )

  if (event.href) {
    return (
      <Link href={event.href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}

export function NewsSection() {
  const t = useTranslations("common")

  if (upcomingEvents.length === 0) return null

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        {t("news")}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        {t("newsSubtitle")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} learnMore={t("learnMore")} />
        ))}
      </div>
    </section>
  )
}
