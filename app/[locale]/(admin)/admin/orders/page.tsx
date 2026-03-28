import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdersTable } from "@/components/admin/OrdersTable"

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("admin")

  // Gauname visus užsakymus
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          artwork: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("orders")}</h1>
        <p className="text-gray-500 mt-2">{t("ordersDescription")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("allOrders")}</CardTitle>
          <CardDescription>
            {t("totalOrdersCount")}: {orders.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} locale={locale} />
        </CardContent>
      </Card>
    </div>
  )
}
