import { getTranslations } from "next-intl/server"
import type { PreviewArtworkJson } from "@/lib/collections-page-preview"
import { ShopArtworkCard } from "@/components/shop/ShopArtworkCard"
import { buildPreviewShopArtworks } from "@/lib/shop-page-preview"

type PreviewMessages = {
  badge: string
  a11yRegionLabel: string
  artworkExamples: PreviewArtworkJson[]
}

export async function ShopPagePreview() {
  const t = await getTranslations("shopPage")
  const raw = t.raw("preview") as PreviewMessages
  const artworks = buildPreviewShopArtworks(raw.artworkExamples)

  return (
    <div className="mt-10 space-y-4">
      <p className="text-sm font-medium text-muted-foreground border-l-4 border-primary pl-3 py-1">
        {raw.badge}
      </p>
      <section
        aria-label={raw.a11yRegionLabel}
        className="rounded-lg border border-dashed border-muted-foreground/35 bg-muted/25 p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ShopArtworkCard key={artwork.id} artwork={artwork} isPreview />
          ))}
        </div>
      </section>
    </div>
  )
}
