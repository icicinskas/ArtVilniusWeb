import { getTranslations } from "next-intl/server"
import { getArtworksForSale } from "@/lib/shop"
import { ShopArtworkCard } from "@/components/shop/ShopArtworkCard"

export default async function ShopPage() {
  const t = await getTranslations("shopPage")
  const artworks = await getArtworksForSale()

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{t("title")}</h1>
        <p className="text-base sm:text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {artworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ShopArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-lg">{t("noArtworks")}</p>
        </div>
      )}
    </div>
  )
}
