import { getTranslations } from "next-intl/server"
import { NavigationCards } from "@/components/home/NavigationCards"
import { NewsSection } from "@/components/home/NewsSection"
import { CallToActionBanner } from "@/components/home/CallToActionBanner"

export default async function HomePage() {
  const t = await getTranslations("common")

  return (
    <div>
      {/* Paieškos/Tyrinėjimo sritis */}
      <div className="flex justify-center">
        <div className="text-center mb-0">
          <h2 className="text-xl md:text-2xl font-light text-gray-400 mb-0 leading-tight">
            {t("browse")}
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-snug">
            {t("browseSubtitle")}
          </p>
        </div>
      </div>

      {/* Navigacijos kortelės */}
      <div className="mt-0 mb-1">
        <NavigationCards />
      </div>

      {/* Naujienos – vykstantys ir būsimi renginiai */}
      <NewsSection />

      {/* Kvietimo veikti modalinis langas */}
      <CallToActionBanner />
    </div>
  )
}
