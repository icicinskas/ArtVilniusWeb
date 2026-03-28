import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/lib/routing"
import { getExhibitionById } from "@/lib/exhibitions"
import { format } from "date-fns"
import { lt } from "date-fns/locale"
import { Calendar, MapPin, ArrowLeft, Images } from "lucide-react"

interface ExhibitionPageProps {
  params: { exhibitionId: string }
}

export default async function ExhibitionDetailPage({ params }: ExhibitionPageProps) {
  const exhibition = getExhibitionById(params.exhibitionId)

  if (!exhibition) {
    notFound()
  }

  const t = await getTranslations("galleryPage")
  const tCommon = await getTranslations("common")

  const isSameDay =
    !exhibition.endDate ||
    exhibition.startDate.getTime() === exhibition.endDate.getTime()

  const dateText = isSameDay
    ? format(exhibition.startDate, "yyyy-MM-dd", { locale: lt })
    : `${format(exhibition.startDate, "yyyy-MM-dd", { locale: lt })} – ${format(exhibition.endDate!, "yyyy-MM-dd", { locale: lt })}`

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {tCommon("gallery")}
      </Link>

      {exhibition.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted mb-8">
          <Image
            src={exhibition.imageUrl}
            alt={exhibition.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      ) : (
        <div className="aspect-[16/9] rounded-xl bg-muted flex items-center justify-center mb-8">
          <Images className="h-24 w-24 text-muted-foreground/50" />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">{exhibition.title}</h1>

      <div className="space-y-3 text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{dateText}</span>
        </div>
        {exhibition.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{exhibition.location}</span>
          </div>
        )}
      </div>

      {exhibition.description && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {exhibition.description}
          </p>
        </div>
      )}
    </div>
  )
}
