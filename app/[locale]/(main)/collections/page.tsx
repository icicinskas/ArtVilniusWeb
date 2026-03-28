import { getTranslations } from "next-intl/server"
import { getServerSession } from "@/lib/session"
import { getAllCollections } from "@/lib/collections-db"
import { ArtworkCard } from "@/components/gallery/ArtworkCard"
import { CollectionFormSidebar } from "@/components/collections/CollectionFormSidebar"

export default async function CollectionsPage() {
  const t = await getTranslations("collectionsPage")
  const session = await getServerSession()
  const isAdmin = session?.user?.role === "ADMIN"
  const collections = await getAllCollections()

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
          {t("title")}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <CollectionFormSidebar isAdmin={isAdmin} />

        <main className="flex-1 min-w-0">
          {collections.length > 0 ? (
            <div className="space-y-12">
              {collections.map((collection) => (
                <section key={collection.id}>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">{collection.title}</h2>
                    {collection.description && (
                      <p className="text-muted-foreground text-sm mt-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  {collection.artworks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {collection.artworks.map((artwork) => (
                        <ArtworkCard key={artwork.id} artwork={artwork} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-4">
                      {t("noArtworksInCollection")}
                    </p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-lg">{t("noCollections")}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
