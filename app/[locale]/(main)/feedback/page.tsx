import { useTranslations } from "next-intl"

export default function FeedbackPage() {
  const t = useTranslations("common")

  return (
    <div className="container px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("sendFeedback")}</h1>
      <p className="text-muted-foreground">
        Atsiliepimų forma bus pridėta vėliau
      </p>
    </div>
  )
}
