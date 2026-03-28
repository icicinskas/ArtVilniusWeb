"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface OrderItem {
  id: string
  quantity: number
  price: number
  artwork: {
    id: string
    title: string
    imageUrl: string
  }
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  user: {
    id: string
    email: string
    name: string | null
  }
  items: OrderItem[]
}

interface OrdersTableProps {
  orders: Order[]
  locale: string
  readOnly?: boolean
}

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const

export function OrdersTable({ orders, locale, readOnly = false }: OrdersTableProps) {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const router = useRouter()
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleViewClick = (order: Order) => {
    setViewingOrder(order)
    setSelectedStatus(order.status)
  }

  const handleStatusUpdate = async () => {
    if (!viewingOrder || !selectedStatus) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${viewingOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      toast({
        title: t("success"),
        description: t("orderStatusUpdated"),
      })

      setViewingOrder(null)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("updateError"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default"
      case "SHIPPED":
        return "default"
      case "PROCESSING":
        return "secondary"
      case "PENDING":
        return "outline"
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">{t("orderId")}</th>
              <th className="text-left p-4 font-semibold">{t("customer")}</th>
              <th className="text-left p-4 font-semibold">{t("items")}</th>
              <th className="text-left p-4 font-semibold">{t("total")}</th>
              <th className="text-left p-4 font-semibold">{t("status")}</th>
              <th className="text-left p-4 font-semibold">{t("date")}</th>
              <th className="text-left p-4 font-semibold">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <div>{order.user.name || order.user.email}</div>
                  {order.user.name && (
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  )}
                </td>
                <td className="p-4">{order.items.length}</td>
                <td className="p-4 font-semibold">€{order.total.toFixed(2)}</td>
                <td className="p-4">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString(locale)}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewClick(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("orderDetails")}</DialogTitle>
            <DialogDescription>
              {t("orderId")}: {viewingOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4 py-4">
              {!readOnly && (
                <div>
                  <label className="text-sm font-medium">{t("status")}</label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {readOnly && (
                <div>
                  <label className="text-sm font-medium">{t("status")}</label>
                  <div className="mt-2">
                    <Badge variant={getStatusBadgeVariant(viewingOrder.status)}>
                      {viewingOrder.status}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">{t("orderItems")}</h3>
                <div className="space-y-2">
                  {viewingOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-2 border rounded">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={item.artwork.imageUrl}
                          alt={item.artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.artwork.title}</div>
                        <div className="text-sm text-gray-500">
                          {t("quantity")}: {item.quantity} × €{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-semibold">
                        €{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold">{t("total")}:</span>
                <span className="text-xl font-bold">€{viewingOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingOrder(null)}
            >
              {t("close")}
            </Button>
            {!readOnly && (
              <Button onClick={handleStatusUpdate} disabled={isLoading}>
                {isLoading ? t("saving") : t("save")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
