import { getTranslations } from "next-intl/server"
import { Link } from "@/lib/routing"
import { getNavigationLinks } from "@/lib/navigation"

export async function Footer() {
  const t = await getTranslations("common")
  const navigationLinks = await getNavigationLinks("FOOTER")
  
  // Skirstome nuorodas į kategorijas pagal translation key
  const navigationSectionLinks = navigationLinks.filter(
    (link) => 
      link.translationKey === "home" ||
      link.translationKey === "gallery" ||
      link.translationKey === "shop" ||
      link.translationKey === "education"
  )
  
  const informationSectionLinks = navigationLinks.filter(
    (link) =>
      link.translationKey === "about" ||
      link.translationKey === "contact"
  )

  return (
    <footer className="border-t bg-background">
      <div className="px-4 md:px-6 py-8 lg:pl-64">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Art Vilna</h3>
              <p className="text-sm text-muted-foreground">
                {t("tagline")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("navigation")}</h4>
              <ul className="space-y-2 text-sm">
                {navigationSectionLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {t(link.translationKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("information")}</h4>
              <ul className="space-y-2 text-sm">
                {informationSectionLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {t(link.translationKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t("contacts")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("city")}
                <br />
                info@artvilna.lt
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Art Vilna. {t("rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
