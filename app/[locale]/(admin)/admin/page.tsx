import { getTranslations } from "next-intl/server"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Image, ShoppingCart, DollarSign } from "lucide-react"
import { Link } from "@/lib/routing"

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("admin")
  const session = await getServerSession()

  // Gauname statistikas
  const [usersCount, artworksCount, ordersCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.artwork.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),
  ])

  const stats = [
    {
      title: t("totalUsers"),
      value: usersCount,
      icon: Users,
      description: t("registeredUsers"),
    },
    {
      title: t("totalArtworks"),
      value: artworksCount,
      icon: Image,
      description: t("artworksInGallery"),
    },
    {
      title: t("totalOrders"),
      value: ordersCount,
      icon: ShoppingCart,
      description: t("completedOrders"),
    },
    {
      title: t("totalRevenue"),
      value: `€${(totalRevenue._sum.total || 0).toFixed(2)}`,
      icon: DollarSign,
      description: t("totalSales"),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("dashboard")}</h1>
        <p className="text-gray-500 mt-2">
          {t("welcome")}, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("quickActions")}</CardTitle>
          <CardDescription>{t("quickActionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{t("manageUsers")}</h3>
              <p className="text-sm text-gray-500">{t("manageUsersDescription")}</p>
            </Link>
            <Link
              href="/admin/artworks"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{t("manageArtworks")}</h3>
              <p className="text-sm text-gray-500">{t("manageArtworksDescription")}</p>
            </Link>
            <Link
              href="/admin/orders"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{t("manageOrders")}</h3>
              <p className="text-sm text-gray-500">{t("manageOrdersDescription")}</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
