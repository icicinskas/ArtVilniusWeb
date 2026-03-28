"use client"

import * as React from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Heart, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Artwork } from "@prisma/client"

interface LightboxProps {
  artwork: Artwork | null
  isOpen: boolean
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  onFavorite?: (artwork: Artwork) => void
  isFavorite?: boolean
  hasNext?: boolean
  hasPrevious?: boolean
  showWatermark?: boolean
}

export function Lightbox({
  artwork,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onFavorite,
  isFavorite = false,
  hasNext = false,
  hasPrevious = false,
  showWatermark = false,
}: LightboxProps) {
  const [imageError, setImageError] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && hasPrevious) onPrevious?.()
      if (e.key === "ArrowRight" && hasNext) onNext?.()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, hasNext, hasPrevious, onClose, onNext, onPrevious])

  if (!artwork) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl w-full p-0 gap-0 max-h-[95vh] overflow-hidden flex flex-col">
        <div className="relative flex flex-col lg:flex-row min-h-0 flex-1 overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full lg:w-2/3 aspect-square lg:aspect-auto lg:min-h-[50vh] lg:max-h-[80vh] bg-black shrink-0">
            {!imageError ? (
              <>
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                  priority
                />
                {showWatermark && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-white text-4xl font-bold opacity-30">
                      Art Vilna
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-white">
                Paveikslas nerastas
              </div>
            )}

            {/* Navigation Buttons */}
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={onPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={onNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              {onFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "bg-black/50 hover:bg-black/70 text-white",
                    isFavorite && "bg-destructive/50 hover:bg-destructive/70"
                  )}
                  onClick={() => onFavorite(artwork)}
                >
                  <Heart
                    className={cn("h-5 w-5", isFavorite && "fill-current")}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={() => window.open(artwork.imageUrl, "_blank")}
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/3 p-4 sm:p-6 overflow-y-auto min-h-0 flex-1 lg:max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl mb-2">
                {artwork.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {artwork.description && (
                <p className="text-muted-foreground">{artwork.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{artwork.category}</Badge>
                {artwork.technique && (
                  <Badge variant="secondary">{artwork.technique}</Badge>
                )}
                {artwork.year && <Badge variant="outline">{artwork.year}</Badge>}
                {artwork.dimensions && (
                  <Badge variant="outline">{artwork.dimensions}</Badge>
                )}
              </div>

              {artwork.isForSale && artwork.price && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">
                      {artwork.price.toFixed(2)} €
                    </span>
                    <Button>Į krepšelį</Button>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground pt-4 border-t">
                <p>Sukurta: {new Date(artwork.createdAt).toLocaleDateString("lt-LT")}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
