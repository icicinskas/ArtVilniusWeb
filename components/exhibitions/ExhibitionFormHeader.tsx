"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

interface ExhibitionFormHeaderProps {
  isAdmin?: boolean
}

export function ExhibitionFormHeader({ isAdmin = false }: ExhibitionFormHeaderProps) {
  const t = useTranslations("exhibitionsPage")
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
      const response = await fetch("/api/admin/exhibitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nepavyko sukurti parodos")
      }

      toast({
        title: t("success"),
        description: t("exhibitionCreated"),
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
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="shrink-0">
          {!isExpanded ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("addExhibition")}
            </Button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 p-4 rounded-lg border bg-muted/30 min-w-[280px]"
            >
              <Input
                placeholder={t("exhibitionTitlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <Textarea
                placeholder={t("exhibitionDescriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !title.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("save")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
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
      </div>
    </div>
  )
}
