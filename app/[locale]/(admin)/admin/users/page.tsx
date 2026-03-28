import { getTranslations } from "next-intl/server"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UsersTable } from "@/components/admin/UsersTable"

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("admin")
  const session = await getServerSession()

  // Gauname visus vartotojus
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("users")}</h1>
        <p className="text-gray-500 mt-2">{t("usersDescription")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allUsers")}</CardTitle>
          <CardDescription>
            {t("totalUsersCount")}: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} locale={locale} />
        </CardContent>
      </Card>
    </div>
  )
}
