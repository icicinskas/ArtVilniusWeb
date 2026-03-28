import { useTranslations } from "next-intl"

export default function SettingsPage() {
  const t = useTranslations("common")

  return (
    <div className="container px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("settings")}</h1>
      <p className="text-muted-foreground">
        Nustatymų informacija bus pridėta vėliau
      </p>
    </div>
  )
}
