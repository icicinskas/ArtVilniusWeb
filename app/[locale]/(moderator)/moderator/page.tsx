import { getTranslations } from "next-intl/server"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Image, MessageSquare, ShoppingCart, Eye } from "lucide-react"

export default async function ModeratorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("moderator")
  const session = await getServerSession()

  // Gauname statistikas (tik tai, ką moderator gali matyti)
  const [artworksCount, publishedArtworksCount, commentsCount, pendingOrdersCount] = await Promise.all([
    prisma.artwork.count(),
    prisma.artwork.count({ where: { isPublished: true } }),
    prisma.comment.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ])

  const stats = [
    {
      title: t("totalArtworks"),
      value: artworksCount,
      icon: Image,
      description: t("artworksInGallery"),
    },
    {
      title: t("publishedArtworks"),
      value: publishedArtworksCount,
      icon: Eye,
      description: t("publishedArtworksDescription"),
    },
    {
      title: t("totalComments"),
      value: commentsCount,
      icon: MessageSquare,
      description: t("commentsInSystem"),
    },
    {
      title: t("pendingOrders"),
      value: pendingOrdersCount,
      icon: ShoppingCart,
      description: t("ordersAwaitingProcessing"),
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
            <a
              href={`/${locale}/moderator/artworks`}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{t("manageArtworks")}</h3>
              <p className="text-sm text-gray-500">{t("manageArtworksDescription")}</p>
            </a>
            <a
              href={`/${locale}/moderator/comments`}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{t("manageComments")}</h3>
              <p className="text-sm text-gray-500">{t("manageCommentsDescription")}</p>
            </a>
            <a
              href={`/${locale}/moderator/orders`}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{t("viewOrders")}</h3>
              <p className="text-sm text-gray-500">{t("viewOrdersDescription")}</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
