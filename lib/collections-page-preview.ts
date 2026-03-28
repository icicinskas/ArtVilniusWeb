import type { Artwork, Collection } from "@prisma/client"

export type PreviewArtworkJson = {
  title: string
  description?: string
  category: string
  technique?: string
  year?: number
  isForSale?: boolean
  price?: number
}

const PREVIEW_DATE = new Date("2024-01-01T00:00:00.000Z")

export function buildPreviewCollectionBlock(
  collectionTitle: string,
  collectionDescription: string,
  items: PreviewArtworkJson[]
): { collection: Collection; artworks: Artwork[] } {
  const artworks: Artwork[] = items.map((item, index) => {
    const forSale = Boolean(item.isForSale && item.price != null)
    return {
      id: `preview-art-${index}`,
      title: item.title,
      description: item.description ?? null,
      imageUrl: `https://picsum.photos/seed/artvilnius-coll-${index}/800/800`,
      imageMetadata: null,
      price: forSale ? item.price! : null,
      category: item.category,
      technique: item.technique ?? null,
      dimensions: null,
      year: item.year ?? null,
      isForSale: forSale,
      isPublished: true,
      exhibitionId: null,
      collectionId: "preview-coll",
      showInShop: false,
      createdAt: PREVIEW_DATE,
      updatedAt: PREVIEW_DATE,
    }
  })

  const collection: Collection = {
    id: "preview-coll",
    title: collectionTitle,
    description: collectionDescription,
    order: 0,
    createdAt: PREVIEW_DATE,
    updatedAt: PREVIEW_DATE,
  }

  return { collection, artworks }
}
