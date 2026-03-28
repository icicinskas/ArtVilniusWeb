import { getTranslations } from "next-intl/server"
import { getServerSession } from "@/lib/session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("admin")
  const session = await getServerSession()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("settings")}</h1>
        <p className="text-gray-500 mt-2">{t("settingsDescription")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("generalSettings")}</CardTitle>
          <CardDescription>{t("generalSettingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm user={session} locale={locale} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("systemInfo")}</CardTitle>
          <CardDescription>{t("systemInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("adminEmail")}:</span>
              <span className="font-medium">{session?.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("adminRole")}:</span>
              <span className="font-medium">{session?.user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("environment")}:</span>
              <span className="font-medium">{process.env.NODE_ENV || "development"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
