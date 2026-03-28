import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { getArtistById, getArtistImage, getArtistLabel } from "@/lib/artists"
import { ArtistWorks } from "@/components/artists/ArtistWorks"
import { ArtistActionBar } from "@/components/artists/ArtistActionBar"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/db"

interface ArtistPageProps {
  params: { artistId: string }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const t = await getTranslations("artistsDetail")
  const artist = getArtistById(params.artistId)

  if (!artist) {
    notFound()
  }

  const session = await getServerSession()
  const favoriteModel = (prisma as any).favoriteAction
  const favoriteCount = favoriteModel
    ? await favoriteModel.count({
        where: {
          targetType: "ARTIST",
          targetId: artist.id,
        },
      })
    : 0

  const isFavorited =
    session?.user?.id && favoriteModel
      ? Boolean(
          await favoriteModel.findUnique({
            where: {
              userId_targetType_targetId: {
                userId: session.user.id,
                targetType: "ARTIST",
                targetId: artist.id,
              },
            },
            select: { id: true },
          })
        )
      : false

  const heroImage = getArtistImage(artist)
  const artistName = getArtistLabel(artist)
  const dateRange = artist.deathDate
    ? `${artist.birthDate} - ${artist.deathDate}`
    : `${artist.birthDate} - ${t("present")}`

  return (
    <div className="-mt-14 pb-16">
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px]">
        <Image
          src={heroImage}
          alt={artistName}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mt-10 text-3xl font-semibold sm:text-4xl">
            {artistName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{dateRange}</p>
          <ArtistActionBar
            targetType="ARTIST"
            targetId={artist.id}
            artistFirstName={artist.firstName}
            artistLastName={artist.lastName}
            shareTitle={artistName}
            initialCount={favoriteCount}
            initialIsFavorite={isFavorited}
            isAuthenticated={Boolean(session?.user?.id)}
          />
          <p className="mt-6 text-sm text-muted-foreground">
            {artist.shortBio}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {t("onlineExhibit")}
            </p>
            <p className="mt-2 text-lg font-semibold">{t("highlights")}</p>
            <p className="text-sm text-muted-foreground">
              {t("highlightsSubtitle")}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("stories")}</h2>
              <button className="text-sm font-medium text-primary">
                {t("viewAll")}
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {artist.stories.map((story) => (
                <div
                  key={story.title}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="space-y-1 p-3 text-sm">
                    <p className="text-xs uppercase text-muted-foreground">
                      {t("story")}
                    </p>
                    <p className="font-medium">{story.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {story.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{t("discover")}</h2>
            <ArtistWorks artistId={artist.id} artworks={artist.artworks} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">{t("moreMovements")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {artist.movements.map((movement) => (
                <div
                  key={movement.name}
                  className="relative h-32 overflow-hidden rounded-xl"
                >
                  <Image
                    src={movement.image}
                    alt={movement.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-semibold">{movement.name}</p>
                    <p className="text-xs text-white/80">
                      {movement.items} {t("items")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{t("moreMediums")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {artist.mediums.map((medium) => (
                <div
                  key={medium.name}
                  className="relative h-32 overflow-hidden rounded-xl"
                >
                  <Image
                    src={medium.image}
                    alt={medium.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-semibold">{medium.name}</p>
                    <p className="text-xs text-white/80">
                      {medium.items} {t("items")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
