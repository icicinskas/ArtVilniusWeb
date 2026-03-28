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
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Link } from "@/lib/routing"
import Image from "next/image"

interface Artwork {
  id: string
  title: string
  description: string | null
  imageUrl: string
  price: number | null
  category: string
  technique: string | null
  isForSale: boolean
  isPublished: boolean
  createdAt: Date
  _count: {
    favorites: number
    comments: number
    orderItems: number
  }
}

interface ArtworksTableProps {
  artworks: Artwork[]
  locale: string
}

export function ArtworksTable({ artworks, locale }: ArtworksTableProps) {
  const t = useTranslations("admin")
  const { toast } = useToast()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return

    setIsLoading(true)
    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/artworks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete artwork")
      }

      toast({
        title: t("success"),
        description: t("artworkDeleted"),
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("deleteError"),
      })
    } finally {
      setIsLoading(false)
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/artworks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update artwork")
      }

      toast({
        title: t("success"),
        description: currentStatus ? t("artworkUnpublished") : t("artworkPublished"),
      })

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-semibold">{t("image")}</th>
            <th className="text-left p-4 font-semibold">{t("title")}</th>
            <th className="text-left p-4 font-semibold">{t("category")}</th>
            <th className="text-left p-4 font-semibold">{t("price")}</th>
            <th className="text-left p-4 font-semibold">{t("status")}</th>
            <th className="text-left p-4 font-semibold">{t("stats")}</th>
            <th className="text-left p-4 font-semibold">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((artwork) => (
            <tr key={artwork.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="p-4">
                <div className="font-medium">{artwork.title}</div>
                {artwork.description && (
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {artwork.description}
                  </div>
                )}
              </td>
              <td className="p-4">
                <Badge variant="outline">{artwork.category}</Badge>
              </td>
              <td className="p-4">
                {artwork.price ? `€${artwork.price.toFixed(2)}` : "-"}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Badge variant={artwork.isPublished ? "default" : "secondary"}>
                    {artwork.isPublished ? t("published") : t("draft")}
                  </Badge>
                  {artwork.isForSale && (
                    <Badge variant="outline">{t("forSale")}</Badge>
                  )}
                </div>
              </td>
              <td className="p-4 text-sm text-gray-500">
                <div>{t("favorites")}: {artwork._count.favorites}</div>
                <div>{t("comments")}: {artwork._count.comments}</div>
                <div>{t("orders")}: {artwork._count.orderItems}</div>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(artwork.id, artwork.isPublished)}
                    disabled={isLoading}
                  >
                    {artwork.isPublished ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Link href={`/admin/artworks/${artwork.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(artwork.id)}
                    disabled={isLoading || deletingId === artwork.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
