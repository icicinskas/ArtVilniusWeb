"use client"

import Image from "next/image"
import { Link } from "@/lib/routing"
import { cn } from "@/lib/utils"
import { useState, useMemo, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Images, ShoppingBag, BookOpen, Paintbrush, Library } from "lucide-react"

const CARD_COUNT = 5
const MIN_CARD_SIZE = 180
const MAX_CARD_SIZE = 420
const MIN_OVERLAP_RATIO = 0.22
const MAX_OVERLAP_RATIO = 0.38

function useViewportWidth() {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const update = () => setWidth(typeof window !== "undefined" ? window.innerWidth : 0)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return width
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

function useResponsiveCardMetrics(containerWidth: number, cardCount: number) {
  return useMemo(() => {
    if (containerWidth <= 0) return { cardSize: 256, overlap: 80 }

    const availableWidth = containerWidth - 16
    const overlapRatio = Math.min(
      MAX_OVERLAP_RATIO,
      Math.max(MIN_OVERLAP_RATIO, 0.22 + (availableWidth / 1200) * 0.16)
    )
    const divisor = cardCount - (cardCount - 1) * overlapRatio
    let cardSize = availableWidth / divisor
    cardSize = Math.min(MAX_CARD_SIZE, Math.max(MIN_CARD_SIZE, cardSize))
    const overlap = Math.round(cardSize * overlapRatio)

    return { cardSize, overlap }
  }, [containerWidth, cardCount])
}

interface NavigationCard {
  name: string
  href: string
  image: string
}

function CardContent({
  card,
  index,
  imageErrors,
  imageLoaded,
  placeholderIcons,
  placeholderColors,
  isHovered,
  onImageError,
  onImageLoad,
}: {
  card: NavigationCard
  index: number
  imageErrors: Set<number>
  imageLoaded: Set<number>
  placeholderIcons: React.ComponentType<{ className?: string }>[]
  placeholderColors: string[]
  isHovered: boolean
  onImageError: (i: number) => void
  onImageLoad: (i: number) => void
}) {
  return (
    <div className="relative w-full h-full aspect-square overflow-hidden">
      {imageErrors.has(index) ? (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br",
          placeholderColors[index % placeholderColors.length]
        )}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {(() => {
              const Icon = placeholderIcons[index % placeholderIcons.length]
              return <Icon className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white/80 mb-2" />
            })()}
          </div>
        </div>
      ) : (
        <>
          {!imageLoaded.has(index) && (
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br animate-pulse z-10",
              placeholderColors[index % placeholderColors.length]
            )}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {(() => {
                  const Icon = placeholderIcons[index % placeholderIcons.length]
                  return <Icon className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white/60 mb-2" />
                })()}
              </div>
            </div>
          )}
          <Image
            src={card.image}
            alt={card.name}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              isHovered && "scale-125",
              !imageLoaded.has(index) && "opacity-0"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 420px"
            onError={() => onImageError(index)}
            onLoad={() => onImageLoad(index)}
            unoptimized
          />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg text-center uppercase tracking-wide break-words max-w-full">
          {card.name}
        </h3>
      </div>
    </div>
  )
}

export function NavigationCards() {
  const t = useTranslations("common")
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [imageLoaded, setImageLoaded] = useState<Set<number>>(new Set())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const viewportWidth = useViewportWidth()
  const { ref: containerRef, width: containerWidth } = useContainerWidth()

  const isMobile = viewportWidth > 0 && viewportWidth < 768
  const { cardSize, overlap: cardOverlap } = useResponsiveCardMetrics(
    isMobile ? 0 : containerWidth,
    CARD_COUNT
  )

  const navigationCards: NavigationCard[] = useMemo(() => [
    { name: t("gallery"), href: "/gallery", image: "/images/frontend/gallery.jpg" },
    { name: t("shop"), href: "/shop", image: "/images/frontend/shop.jpg" },
    { name: t("education"), href: "/education", image: "/images/frontend/education.jpg" },
    { name: t("artists"), href: "/artists", image: "/images/frontend/artists.jpg" },
    { name: t("collections"), href: "/collections", image: "/images/frontend/collections.jpg" },
  ], [t])

  const placeholderIcons = [
    Images,
    ShoppingBag,
    BookOpen,
    Paintbrush,
    Library,
  ]

  const placeholderColors = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-indigo-500 to-blue-600",
    "from-amber-500 to-yellow-600",
  ]

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index))
  }

  const handleImageLoad = (index: number) => {
    setImageErrors((prev) => {
      const next = new Set(prev)
      next.delete(index)
      return next
    })
    setImageLoaded((prev) => new Set(prev).add(index))
  }

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    navigationCards.forEach((card, index) => {
      if (!imageLoaded.has(index) && !imageErrors.has(index)) {
        const timeout = setTimeout(() => {
          setImageLoaded((prev) => {
            if (!prev.has(index)) {
              setImageErrors((prevErrors) => new Set(prevErrors).add(index))
            }
            return prev
          })
        }, 15000)
        timeouts.push(timeout)
      }
    })
    return () => timeouts.forEach((t) => clearTimeout(t))
  }, [navigationCards.length, imageLoaded, imageErrors])

  const activeIndex = hoveredIndex ?? 0

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Overlay text - responsive */}
      <div className="absolute inset-x-0 top-0 pointer-events-none">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white/30 select-none px-2 sm:px-4 text-center leading-tight">
          PLAC ARTIS MUSEUMS MES
        </h1>
      </div>

      {/* Mobile: 2 columns grid */}
      {isMobile && (
        <div className="pt-8 sm:pt-10 overflow-hidden">
          <div className="grid grid-cols-2 gap-3 overflow-hidden">
            {navigationCards.map((card, index) => (
              <Link
                key={card.href}
                href={card.href}
                className="block rounded-xl overflow-hidden shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                <CardContent
                  card={card}
                  index={index}
                  imageErrors={imageErrors}
                  imageLoaded={imageLoaded}
                  placeholderIcons={placeholderIcons}
                  placeholderColors={placeholderColors}
                  isHovered={false}
                  onImageError={handleImageError}
                  onImageLoad={handleImageLoad}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tablet & Desktop: horizontalus persidengiantis layoutas – visos kortelės matomos be slinkties */}
      {!isMobile && (
        <div className="pt-10 overflow-hidden">
          <div className="flex justify-center items-start min-h-[200px] md:min-h-[256px] lg:min-h-[280px]">
            <div className="flex justify-center items-start origin-center">
              {navigationCards.map((card, index) => {
                const overlap = -cardOverlap
                const isHovered = hoveredIndex === index
                const distance = Math.abs(index - activeIndex)
                let scale = 1

                if (hoveredIndex !== null) {
                  if (isHovered) {
                    scale = 1.15
                  } else {
                    const maxDistance = navigationCards.length - 1
                    const normalizedDistance = distance / maxDistance
                    scale = Math.max(0.75, 1 - normalizedDistance * normalizedDistance * 0.25)
                  }
                } else {
                  scale = 1.0 - (distance / (navigationCards.length - 1)) * 0.25
                }

                const zIndex = 1000 - distance

                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="block rounded-xl overflow-hidden shadow-lg transition-all duration-300 shrink-0"
                    style={{
                      width: cardSize,
                      height: cardSize,
                      marginLeft: index > 0 ? overlap : 0,
                      zIndex,
                      transform: `scale(${scale})`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <CardContent
                      card={card}
                      index={index}
                      imageErrors={imageErrors}
                      imageLoaded={imageLoaded}
                      placeholderIcons={placeholderIcons}
                      placeholderColors={placeholderColors}
                      isHovered={isHovered}
                      onImageError={handleImageError}
                      onImageLoad={handleImageLoad}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
