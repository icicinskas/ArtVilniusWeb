import { getTranslations } from "next-intl/server"
import { ArtworkCard } from "@/components/gallery/ArtworkCard"
import {
  buildPreviewCollectionBlock,
  type PreviewArtworkJson,
} from "@/lib/collections-page-preview"

type PreviewMessages = {
  badge: string
  a11yRegionLabel: string
  collectionTitle: string
  collectionDescription: string
  artworkExamples: PreviewArtworkJson[]
}

export async function CollectionsPagePreview() {
  const t = await getTranslations("collectionsPage")
  const raw = t.raw("preview") as PreviewMessages
  const { collection, artworks } = buildPreviewCollectionBlock(
    raw.collectionTitle,
    raw.collectionDescription,
    raw.artworkExamples
  )

  return (
    <div className="mt-10 space-y-4">
      <p className="text-sm font-medium text-muted-foreground border-l-4 border-primary pl-3 py-1">
        {raw.badge}
      </p>
      <section
        aria-label={raw.a11yRegionLabel}
        className="rounded-lg border border-dashed border-muted-foreground/35 bg-muted/25 p-6 sm:p-8"
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{collection.title}</h2>
          {collection.description && (
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">
              {collection.description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>
    </div>
  )
}
