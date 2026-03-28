"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Link } from "@/lib/routing"
import { cn } from "@/lib/utils"
import type { EducationalActivity } from "@/lib/educational-activities"

interface EducationActivityCardProps {
  activity: EducationalActivity
  learnMoreText: string
  className?: string
}

export function EducationActivityCard({
  activity,
  learnMoreText,
  className,
}: EducationActivityCardProps) {
  const [imageError, setImageError] = React.useState(false)

  const content = (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg flex flex-col h-full",
        className
      )}
    >
      {activity.imageUrl ? (
        <div className="relative h-40 overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={activity.imageUrl}
              alt={activity.title}
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
      ) : (
        <div className="h-40 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Švietimas</span>
        </div>
      )}
      <CardHeader>
        <h3 className="font-semibold text-lg line-clamp-2">{activity.title}</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {activity.description}
        </p>
      </CardContent>
      {activity.href && (
        <CardFooter className="pt-0">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
            <span>{learnMoreText}</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        </CardFooter>
      )}
    </Card>
  )

  if (activity.href) {
    return (
      <Link href={activity.href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}
