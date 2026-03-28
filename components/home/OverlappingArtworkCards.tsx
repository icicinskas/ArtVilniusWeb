"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Artwork } from "@prisma/client"

interface OverlappingArtworkCardsProps {
  artworks: Artwork[]
}

export function OverlappingArtworkCards({
  artworks,
}: OverlappingArtworkCardsProps) {
  return (
    <div className="relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h1 className="text-3xl md:text-6xl lg:text-8xl font-bold text-white/30 select-none px-4 text-center">
          PLAC ARTIS MUSEUMS MES
        </h1>
      </div>

      {/* Overlapping cards */}
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        {artworks.map((artwork, index) => {
          const rotation = (index - Math.floor(artworks.length / 2)) * 8
          const zIndex = artworks.length - index
          const translateX = (index - Math.floor(artworks.length / 2)) * 20

          return (
            <div
              key={artwork.id}
              className={cn(
                "absolute w-48 h-64 md:w-64 md:h-80 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer",
                "border border-gray-200"
              )}
              style={{
                transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
                zIndex,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                  <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">
                    {artwork.title}
                  </h3>
                  {artwork.category && (
                    <p className="text-xs text-white/80">{artwork.category}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
