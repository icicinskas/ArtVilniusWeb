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
import { Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Comment {
  id: string
  content: string
  rating: number | null
  createdAt: Date
  user: {
    id: string
    email: string
    name: string | null
  }
  artwork: {
    id: string
    title: string
    imageUrl: string
  }
}

interface CommentsTableProps {
  comments: Comment[]
  locale: string
}

export function CommentsTable({ comments, locale }: CommentsTableProps) {
  const t = useTranslations("moderator")
  const { toast } = useToast()
  const router = useRouter()
  const [viewingComment, setViewingComment] = useState<Comment | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleViewClick = (comment: Comment) => {
    setViewingComment(comment)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return

    setIsLoading(true)
    setDeletingId(id)
    try {
      const response = await fetch(`/api/moderator/comments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      toast({
        title: t("success"),
        description: t("commentDeleted"),
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

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">{t("artwork")}</th>
              <th className="text-left p-4 font-semibold">{t("user")}</th>
              <th className="text-left p-4 font-semibold">{t("comment")}</th>
              <th className="text-left p-4 font-semibold">{t("rating")}</th>
              <th className="text-left p-4 font-semibold">{t("date")}</th>
              <th className="text-left p-4 font-semibold">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden">
                      <Image
                        src={comment.artwork.imageUrl}
                        alt={comment.artwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-medium text-sm">{comment.artwork.title}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div>{comment.user.name || comment.user.email}</div>
                  {comment.user.name && (
                    <div className="text-sm text-gray-500">{comment.user.email}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="max-w-md line-clamp-2">{comment.content}</div>
                </td>
                <td className="p-4">
                  {comment.rating !== null ? (
                    <Badge variant="outline">{comment.rating}/5</Badge>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4">
                  {new Date(comment.createdAt).toLocaleDateString(locale)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewClick(comment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isLoading || deletingId === comment.id}
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

      <Dialog open={!!viewingComment} onOpenChange={() => setViewingComment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("commentDetails")}</DialogTitle>
            <DialogDescription>
              {t("commentId")}: {viewingComment?.id}
            </DialogDescription>
          </DialogHeader>
          {viewingComment && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">{t("artwork")}</label>
                <div className="flex items-center gap-3 mt-2 p-2 border rounded">
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={viewingComment.artwork.imageUrl}
                      alt={viewingComment.artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="font-medium">{viewingComment.artwork.title}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">{t("user")}</label>
                <div className="mt-2 p-2 border rounded">
                  <div>{viewingComment.user.name || viewingComment.user.email}</div>
                  {viewingComment.user.name && (
                    <div className="text-sm text-gray-500">{viewingComment.user.email}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">{t("comment")}</label>
                <div className="mt-2 p-4 border rounded bg-gray-50">
                  {viewingComment.content}
                </div>
              </div>

              {viewingComment.rating !== null && (
                <div>
                  <label className="text-sm font-medium">{t("rating")}</label>
                  <div className="mt-2">
                    <Badge variant="outline">{viewingComment.rating}/5</Badge>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">{t("date")}</label>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(viewingComment.createdAt).toLocaleString(locale)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingComment(null)}
            >
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
