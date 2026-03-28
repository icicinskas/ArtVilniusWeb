import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArtworkForm } from "@/components/admin/ArtworkForm"
import { Link } from "@/lib/routing"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function NewArtworkPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("admin")

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/artworks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("addArtwork")}</h1>
          <p className="text-gray-500 mt-2">{t("addArtworkDescription")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("newArtworkForm")}</CardTitle>
          <CardDescription>{t("newArtworkFormDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ArtworkForm locale={locale} />
        </CardContent>
      </Card>
    </div>
  )
}
