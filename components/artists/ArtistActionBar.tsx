"use client"

import { useState } from "react"
import { Heart, Link2, Facebook, Twitter, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import type { FavoriteTargetType } from "@/types/database"

interface ArtistActionBarProps {
  targetType: FavoriteTargetType
  targetId: string
  artistFirstName?: string
  artistLastName?: string
  artworkTitle?: string
  artworkArtistName?: string
  shareTitle: string
  initialCount: number
  initialIsFavorite: boolean
  isAuthenticated: boolean
}

export function ArtistActionBar({
  targetType,
  targetId,
  artistFirstName,
  artistLastName,
  artworkTitle,
  artworkArtistName,
  shareTitle,
  initialCount,
  initialIsFavorite,
  isAuthenticated,
}: ArtistActionBarProps) {
  const t = useTranslations("common")
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorite)
  const [favoriteCount, setFavoriteCount] = useState(initialCount)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getShareUrl = () =>
    typeof window !== "undefined" ? window.location.href : ""

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("loginRequiredFavorite"),
      })
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          artistFirstName,
          artistLastName,
          artworkTitle,
          artworkArtistName,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error?.error || "Failed to save favorite")
      }

      const data = await response.json()
      setIsFavorited(true)
      setFavoriteCount(data.count ?? favoriteCount)

      if (data.alreadyExists) {
        toast({
          title: t("favorites"),
          description: t("favoriteAlreadyAdded"),
        })
      } else {
        toast({
          title: t("favorites"),
          description: t("favoriteAdded"),
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error?.message || t("actionFailed"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async (url: string) => {
    if (!navigator.clipboard) {
      throw new Error("Clipboard is not available")
    }
    await navigator.clipboard.writeText(url)
  }

  const handleCopy = async () => {
    const url = getShareUrl()
    if (!url) return

    try {
      await copyToClipboard(url)
      toast({
        title: t("copiedTitle"),
        description: t("copiedDescription"),
      })
    } catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("copyNotSupported"),
      })
    }
  }

  const handleShare = async () => {
    const url = getShareUrl()
    if (!url) return

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url })
        return
      } catch {
        // User cancelled share; no toast needed
        return
      }
    }

    try {
      await copyToClipboard(url)
      toast({
        title: t("copiedTitle"),
        description: t("shareNotSupported"),
      })
    } catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("copyNotSupported"),
      })
    }
  }

  const handleFacebookShare = () => {
    const url = getShareUrl()
    if (!url) return
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  const handleXShare = () => {
    const url = getShareUrl()
    if (!url) return
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-4 text-muted-foreground">
      <button
        type="button"
        onClick={handleFavorite}
        title={t("favoriteAction")}
        aria-label={`${t("favoriteAction")} (${favoriteCount})`}
        className={cn(
          "flex items-center gap-2 transition hover:text-foreground",
          isFavorited && "text-red-500"
        )}
        disabled={isSubmitting}
      >
        <Heart
          className="h-5 w-5"
          fill={isFavorited ? "currentColor" : "none"}
        />
        <span className="text-xs tabular-nums">{favoriteCount}</span>
      </button>
      <button
        type="button"
        onClick={handleCopy}
        title={t("copyLink")}
        aria-label={t("copyLink")}
        className="transition hover:text-foreground"
      >
        <Link2 className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={handleFacebookShare}
        title={t("shareFacebook")}
        aria-label={t("shareFacebook")}
        className="transition hover:text-foreground"
      >
        <Facebook className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={handleXShare}
        title={t("shareX")}
        aria-label={t("shareX")}
        className="transition hover:text-foreground"
      >
        <Twitter className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={handleShare}
        title={t("share")}
        aria-label={t("share")}
        className="transition hover:text-foreground"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  )
}
