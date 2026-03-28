"use client"

import * as React from "react"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { lt } from "date-fns/locale"

interface Article {
  id: string
  title: string
  excerpt?: string
  content?: string
  imageUrl?: string
  category?: string
  publishedAt: Date
  readTime?: number
  author?: string
}

interface ArticleCardProps {
  article: Article
  onReadMore?: (article: Article) => void
  className?: string
}

export function ArticleCard({
  article,
  onReadMore,
  className,
}: ArticleCardProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg flex flex-col",
        className
      )}
    >
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Paveikslas nerastas
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xl line-clamp-2 flex-1">
            {article.title}
          </h3>
          {article.category && (
            <Badge variant="secondary">{article.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {article.excerpt && (
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(article.publishedAt), "yyyy-MM-dd", {
              locale: lt,
            })}
          </div>
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} min.
            </div>
          )}
          {article.author && (
            <div className="ml-auto">{article.author}</div>
          )}
        </div>
      </CardContent>
      {onReadMore && (
        <CardFooter>
          <Button
            variant="ghost"
            className="w-full group-hover:underline"
            onClick={() => onReadMore(article)}
          >
            Skaityti daugiau
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
