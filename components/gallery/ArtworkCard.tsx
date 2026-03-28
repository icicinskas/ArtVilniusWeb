"use client"

import * as React from "react"
import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Artwork } from "@prisma/client"

interface ArtworkCardProps {
  artwork: Artwork
  onView?: (artwork: Artwork) => void
  onFavorite?: (artwork: Artwork) => void
  isFavorite?: boolean
  showWatermark?: boolean
  className?: string
}

export function ArtworkCard({
  artwork,
  onView,
  onFavorite,
  isFavorite = false,
  showWatermark = false,
  className,
}: ArtworkCardProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {!imageError ? (
          <>
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {showWatermark && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="text-white text-2xl font-bold opacity-50">
                  Art Vilna
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              {onView && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => onView(artwork)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onFavorite && (
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn(
                    "h-8 w-8",
                    isFavorite && "bg-destructive text-destructive-foreground"
                  )}
                  onClick={() => onFavorite(artwork)}
                >
                  <Heart
                    className={cn("h-4 w-4", isFavorite && "fill-current")}
                  />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Paveikslas nerastas
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {artwork.title}
        </h3>
        {artwork.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {artwork.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{artwork.category}</Badge>
          {artwork.technique && (
            <Badge variant="secondary">{artwork.technique}</Badge>
          )}
          {artwork.year && (
            <Badge variant="outline">{artwork.year}</Badge>
          )}
        </div>
      </CardContent>
      {artwork.isForSale && artwork.price && (
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-bold">
              {artwork.price.toFixed(2)} €
            </span>
            <Button size="sm">Į krepšelį</Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
