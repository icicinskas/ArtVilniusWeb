import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getArtistById, getArtistLabel } from "@/lib/artists"
import { Link } from "@/lib/routing"

interface ArtworkPageProps {
  params: { locale: string; artistId: string; artworkId: string }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const t = await getTranslations("artworkDetail")
  const artist = getArtistById(params.artistId)

  if (!artist) {
    notFound()
  }

  const artworkIndex = artist.artworks.findIndex(
    (work) => work.id === params.artworkId
  )

  if (artworkIndex < 0) {
    notFound()
  }

  const artwork = artist.artworks[artworkIndex]
  const totalArtworks = artist.artworks.length
  const prevArtwork =
    artist.artworks[(artworkIndex - 1 + totalArtworks) % totalArtworks]
  const nextArtwork = artist.artworks[(artworkIndex + 1) % totalArtworks]
  const artistName = getArtistLabel(artist)

  return (
    <div className="container px-4 pb-16 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link
          href={`/artists/${artist.id}`}
          className="text-muted-foreground transition hover:text-foreground"
        >
          {t("backToArtist")}
        </Link>
        <span className="text-muted-foreground">{artistName}</span>
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        <Link
          href={`/artists/${artist.id}/artworks/${prevArtwork.id}`}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-sm transition hover:bg-muted"
          aria-label={t("prevArtwork")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-muted">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>
        </div>
        <Link
          href={`/artists/${artist.id}/artworks/${nextArtwork.id}`}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-sm transition hover:bg-muted"
          aria-label={t("nextArtwork")}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mx-auto mt-6 max-w-3xl space-y-3">
        <h1 className="text-2xl font-semibold">{artwork.title}</h1>
        <p className="text-sm text-muted-foreground">{artwork.year}</p>
        <p className="text-sm text-muted-foreground">
          {t("description", {
            artist: artistName,
            title: artwork.title,
            year: artwork.year,
            bio: artist.shortBio,
          })}
        </p>
      </div>
    </div>
  )
}
