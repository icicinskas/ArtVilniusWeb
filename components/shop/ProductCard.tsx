"use client"

import * as React from "react"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Artwork } from "@prisma/client"

interface ProductCardProps {
  product: Artwork
  onAddToCart?: (product: Artwork) => void
  onFavorite?: (product: Artwork) => void
  isFavorite?: boolean
  className?: string
}

export function ProductCard({
  product,
  onAddToCart,
  onFavorite,
  isFavorite = false,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = React.useState(false)

  if (!product.isForSale || !product.price) {
    return null
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg flex flex-col",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {!imageError ? (
          <>
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              {onFavorite && (
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn(
                    "h-8 w-8",
                    isFavorite && "bg-destructive text-destructive-foreground"
                  )}
                  onClick={() => onFavorite(product)}
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
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2 flex-1">
            {product.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline">{product.category}</Badge>
          {product.technique && (
            <Badge variant="secondary">{product.technique}</Badge>
          )}
        </div>
        {product.dimensions && (
          <p className="text-xs text-muted-foreground mb-2">
            Dydis: {product.dimensions}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <div>
            <span className="text-2xl font-bold">
              {product.price.toFixed(2)} €
            </span>
          </div>
          {onAddToCart && (
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Į krepšelį
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
