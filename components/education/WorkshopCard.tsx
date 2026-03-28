"use client"

import * as React from "react"
import Image from "next/image"
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { lt } from "date-fns/locale"

interface Workshop {
  id: string
  title: string
  description?: string
  imageUrl?: string
  date: Date
  duration?: number
  location?: string
  maxParticipants?: number
  currentParticipants?: number
  price?: number
  category?: string
  isFull?: boolean
}

interface WorkshopCardProps {
  workshop: Workshop
  onRegister?: (workshop: Workshop) => void
  onViewDetails?: (workshop: Workshop) => void
  className?: string
}

export function WorkshopCard({
  workshop,
  onRegister,
  onViewDetails,
  className,
}: WorkshopCardProps) {
  const [imageError, setImageError] = React.useState(false)
  const isFull = workshop.isFull || 
    (workshop.maxParticipants && workshop.currentParticipants && 
     workshop.currentParticipants >= workshop.maxParticipants)

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg flex flex-col",
        isFull && "opacity-75",
        className
      )}
    >
      {workshop.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={workshop.imageUrl}
              alt={workshop.title}
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
          {isFull && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">Pilnas</Badge>
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xl line-clamp-2 flex-1">
            {workshop.title}
          </h3>
          {workshop.category && (
            <Badge variant="secondary">{workshop.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {workshop.description && (
          <p className="text-muted-foreground line-clamp-2">
            {workshop.description}
          </p>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(workshop.date), "yyyy-MM-dd HH:mm", {
              locale: lt,
            })}
          </div>
          {workshop.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {workshop.duration} val.
            </div>
          )}
          {workshop.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {workshop.location}
            </div>
          )}
          {workshop.maxParticipants && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              {workshop.currentParticipants || 0} / {workshop.maxParticipants}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        {workshop.price !== undefined && (
          <div className="text-lg font-bold">
            {workshop.price > 0 ? `${workshop.price.toFixed(2)} €` : "Nemokamai"}
          </div>
        )}
        <div className="flex gap-2 ml-auto">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(workshop)}
            >
              Detalės
            </Button>
          )}
          {onRegister && (
            <Button
              size="sm"
              onClick={() => onRegister(workshop)}
              disabled={isFull}
            >
              Registruotis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
