import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/routing"
import { defaultThemes } from "@/lib/themes"
import { Card, CardContent } from "@/components/ui/card"

export default function ThemesPage() {
  const t = useTranslations("themesPage")

  return (
    <div className="container px-4 py-12">
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{t("sidebarTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("sidebarHint")}</p>
            </div>
            <ul className="space-y-1">
              {defaultThemes.map((theme) => (
                <li key={theme.id}>
                  <a
                    href={`#theme-${theme.id}`}
                    className="block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {t(`items.${theme.id}.title`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {defaultThemes.map((theme) => (
            <Link
              key={theme.id}
              id={`theme-${theme.id}`}
              href={`/movements/${theme.movementId}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="overflow-hidden transition-shadow duration-200 group-hover:shadow-lg">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={theme.image}
                    alt={t(`items.${theme.id}.title`)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">
                    {t(`items.${theme.id}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {t(`items.${theme.id}.description`)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
