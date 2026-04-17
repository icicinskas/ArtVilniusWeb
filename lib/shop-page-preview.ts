import type { Artwork } from "@prisma/client"
import type { PreviewArtworkJson } from "@/lib/collections-page-preview"

const PREVIEW_DATE = new Date("2024-01-01T00:00:00.000Z")

/**
 * Sukuria parduotuvės sąrašo peržiūros kūrinius (showInShop + published), atitinkančius DB laukus.
 */
export function buildPreviewShopArtworks(items: PreviewArtworkJson[]): Artwork[] {
  return items.map((item, index) => {
    const forSale = Boolean(item.isForSale && item.price != null)
    return {
      id: `preview-shop-${index}`,
      title: item.title,
      description: item.description ?? null,
      imageUrl: `https://picsum.photos/seed/artvilnius-shop-${index}/800/800`,
      imageMetadata: null,
      price: forSale ? item.price! : null,
      category: item.category,
      technique: item.technique ?? null,
      dimensions: null,
      year: item.year ?? null,
      isForSale: forSale,
      isPublished: true,
      exhibitionId: null,
      collectionId: null,
      showInShop: true,
      createdAt: PREVIEW_DATE,
      updatedAt: PREVIEW_DATE,
    }
  })
}
