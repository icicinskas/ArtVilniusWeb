"use client"

import Image from "next/image"
import { Link } from "@/lib/routing"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Artwork } from "@prisma/client"

interface ShopArtworkCardProps {
  artwork: Artwork
}

export function ShopArtworkCard({ artwork }: ShopArtworkCardProps) {
  return (
    <Link href={`/shop/${artwork.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
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
        {artwork.price != null && (
          <CardFooter className="p-4 pt-0">
            <span className="text-lg font-bold">
              {artwork.price.toFixed(2)} €
            </span>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
