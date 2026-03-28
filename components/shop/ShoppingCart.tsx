"use client"

import * as React from "react"
import Image from "next/image"
import { X, ShoppingCart, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Artwork } from "@prisma/client"

interface CartItem {
  artwork: Artwork
  quantity: number
}

interface ShoppingCartProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem?: (artworkId: string) => void
  onUpdateQuantity?: (artworkId: string, quantity: number) => void
  onCheckout?: () => void
}

export function ShoppingCart({
  items,
  isOpen,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: ShoppingCartProps) {
  const total = items.reduce(
    (sum, item) => sum + (item.artwork.price || 0) * item.quantity,
    0
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Krepšelis ({items.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Krepšelis tuščias</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.artwork.id}
                  className="flex gap-4 p-4 border rounded-lg"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.artwork.imageUrl}
                      alt={item.artwork.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold line-clamp-1">
                      {item.artwork.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.artwork.category}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold">
                        {(item.artwork.price || 0).toFixed(2)} €
                      </span>
                      {onUpdateQuantity && (
                        <div className="flex items-center gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              onUpdateQuantity(
                                item.artwork.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              onUpdateQuantity(
                                item.artwork.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {onRemoveItem && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => onRemoveItem(item.artwork.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tarpinė suma:</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>PVM:</span>
                <span>{(total * 0.21).toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Iš viso:</span>
                <span>{(total * 1.21).toFixed(2)} €</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Tęsti apsipirkimą
              </Button>
              {onCheckout && (
                <Button onClick={onCheckout}>Pirkti</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
