import { getTranslations } from "next-intl/server"
import { getServerSession } from "@/lib/session"
import { getAllExhibitions } from "@/lib/exhibitions-db"
import { ArtworkCard } from "@/components/gallery/ArtworkCard"
import { ExhibitionFormHeader } from "@/components/exhibitions/ExhibitionFormHeader"

export default async function ExhibitionsPage() {
  const t = await getTranslations("exhibitionsPage")
  const session = await getServerSession()
  const isAdmin = session?.user?.role === "ADMIN"
  const exhibitions = await getAllExhibitions()

  return (
    <div className="py-8 sm:py-12">
      <ExhibitionFormHeader isAdmin={isAdmin} />

      {exhibitions.length > 0 ? (
        <div className="space-y-12">
          {exhibitions.map((exhibition) => (
            <section key={exhibition.id}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{exhibition.title}</h2>
                {exhibition.description && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {exhibition.description}
                  </p>
                )}
              </div>
              {exhibition.artworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {exhibition.artworks.map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4">{t("noArtworksInExhibition")}</p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-lg">{t("noExhibitions")}</p>
        </div>
      )}
    </div>
  )
}
