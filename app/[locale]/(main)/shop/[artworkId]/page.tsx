import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/lib/routing"
import { ChevronLeft } from "lucide-react"
import { getArtworkForSaleById } from "@/lib/shop"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ShopArtworkPageProps {
  params: Promise<{ locale: string; artworkId: string }>
}

export default async function ShopArtworkPage({ params }: ShopArtworkPageProps) {
  const { artworkId } = await params
  const t = await getTranslations("shopPage")

  const artwork = await getArtworkForSaleById(artworkId)

  if (!artwork) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 max-w-5xl mx-auto">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("backToShop")}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{artwork.category}</Badge>
              {artwork.technique && (
                <Badge variant="secondary">{artwork.technique}</Badge>
              )}
              {artwork.year && (
                <Badge variant="outline">{artwork.year}</Badge>
              )}
              {artwork.dimensions && (
                <Badge variant="outline">{artwork.dimensions}</Badge>
              )}
            </div>
          </div>

          {artwork.description && (
            <p className="text-muted-foreground">{artwork.description}</p>
          )}

          {artwork.price != null && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <span className="text-2xl font-bold">
                {artwork.price.toFixed(2)} €
              </span>
              <Button size="lg">{t("addToCart")}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
