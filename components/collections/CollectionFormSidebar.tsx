"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

interface CollectionFormSidebarProps {
  isAdmin?: boolean
}

export function CollectionFormSidebar({ isAdmin = false }: CollectionFormSidebarProps) {
  const t = useTranslations("collectionsPage")
  const { toast } = useToast()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nepavyko sukurti kolekcijos")
      }

      toast({
        title: t("success"),
        description: t("collectionCreated"),
      })

      setTitle("")
      setDescription("")
      setIsExpanded(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error instanceof Error ? error.message : t("createError"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) return null

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="rounded-lg border bg-muted/30 p-4 sticky top-20">
        <h3 className="font-semibold mb-3">{t("addCollection")}</h3>
        {!isExpanded ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="h-4 w-4" />
            {t("newCollection")}
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder={t("collectionTitlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <Textarea
              placeholder={t("collectionDescriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !title.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("save")
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExpanded(false)
                  setTitle("")
                  setDescription("")
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </aside>
  )
}
