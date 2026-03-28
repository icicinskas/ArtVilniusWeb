import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArtworksTable } from "@/components/admin/ArtworksTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "@/lib/routing"

export default async function ArtworksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("admin")

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("artworks")}</h1>
          <p className="text-gray-500 mt-2">{t("artworksDescription")}</p>
        </div>
        <Link href="/admin/artworks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("addArtwork")}
          </Button>
        </Link>
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
