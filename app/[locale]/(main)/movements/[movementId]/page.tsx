import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BackButton } from "@/components/movements/BackButton"
import { getMovementById } from "@/lib/movements"

type MovementArtist = {
  name: string
  works: string[]
}

type MovementDetails = {
  overview: string
  implementation: string
  artists: MovementArtist[]
}

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value : [])

const toArtists = (value: unknown): MovementArtist[] => {
  return asArray<MovementArtist>(value).filter(
    (artist) =>
      Boolean(artist?.name) &&
      Array.isArray(artist?.works) &&
      artist.works.length > 0
  )
}

export default async function MovementDetailPage({
  params,
}: {
  params: { movementId: string }
}) {
  const movement = getMovementById(params.movementId)
  if (!movement) notFound()

  const tMov = await getTranslations("movements")
  const baseKey = `items.${movement.id}`

  const movementText = {
    title: tMov(`${baseKey}.title`),
    period: tMov(`${baseKey}.period`),
    summary: tMov(`${baseKey}.summary`),
    region: tMov(`${baseKey}.region`),
    keyIdeas: asArray<string>(tMov.raw(`${baseKey}.keyIdeas`)),
    details: {
      overview: tMov(`${baseKey}.details.overview`),
      implementation: tMov(`${baseKey}.details.implementation`),
      artists: toArtists(tMov.raw(`${baseKey}.details.artists`)),
    } satisfies MovementDetails,
  }

  return (
    <div className="container px-4 py-12">
      <BackButton label={tMov("detail.back")} />

      <div className="mt-6 relative overflow-hidden rounded-2xl border bg-muted/30 p-8 shadow-sm">
        {movement.image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-65"
              style={{ backgroundImage: `url(${movement.image})` }}
            />
            <div className="absolute inset-0 bg-background/60" />
          </>
        )}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{movementText.period}</Badge>
            <Badge variant="outline">{movementText.region}</Badge>
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">
            {movementText.title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {movementText.summary}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{tMov("detail.overviewTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{movementText.details.overview}</p>
            <Separator />
            <div>
              <div className="text-sm font-medium text-foreground">
                {tMov("detail.implementationTitle")}
              </div>
              <p className="mt-2">{movementText.details.implementation}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{tMov("detail.keyIdeasTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {movementText.keyIdeas.map((idea) => (
                <Badge key={idea} variant="outline">
                  {idea}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">
          {tMov("detail.artistsTitle")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movementText.details.artists.map((artist) => (
            <Card key={artist.name} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{artist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {tMov("detail.worksLabel")}
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {artist.works.map((work) => (
                    <li key={work}>{work}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
