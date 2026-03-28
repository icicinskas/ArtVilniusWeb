import { useTranslations } from "next-intl"

export default function ActivityPage() {
  const t = useTranslations("common")

  return (
    <div className="container px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("viewActivity")}</h1>
      <p className="text-muted-foreground">
        Veiklos informacija bus pridėta vėliau
      </p>
    </div>
  )
}
