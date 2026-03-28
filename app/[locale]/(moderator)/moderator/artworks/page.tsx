import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArtworksTable } from "@/components/admin/ArtworksTable"

export default async function ModeratorArtworksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("moderator")

  // Gauname visus kūrinius
  const artworks = await prisma.artwork.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          favorites: true,
          comments: true,
          orderItems: true,
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("artworks")}</h1>
        <p className="text-gray-500 mt-2">{t("artworksDescription")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allArtworks")}</CardTitle>
          <CardDescription>
            {t("totalArtworksCount")}: {artworks.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArtworksTable artworks={artworks} locale={locale} />
        </CardContent>
      </Card>
    </div>
  )
}
