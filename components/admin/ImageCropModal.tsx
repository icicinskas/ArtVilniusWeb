"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import Cropper, { type Area } from "react-easy-crop"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getCroppedImg } from "@/lib/cropImage"

interface ImageCropModalProps {
  imageSrc: string
  isOpen: boolean
  onClose: () => void
  onCropComplete: (blob: Blob, metadata: CropMetadata) => void
  mimeType?: string
}

export interface CropMetadata {
  width: number
  height: number
  format: string
}

export function ImageCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  mimeType = "image/jpeg",
}: ImageCropModalProps) {
  const t = useTranslations("admin")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location)
  }, [])

  const onZoomChange = useCallback((value: number) => {
    setZoom(value)
  }, [])

  const onCropAreaChange = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, mimeType)
      const format = mimeType.split("/")[1] || "jpeg"
      const metadata: CropMetadata = {
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
        format,
      }
      onCropComplete(blob, metadata)
      onClose()
    } catch (error) {
      console.error("Apkarpymo klaida:", error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [
    croppedAreaPixels,
    imageSrc,
    mimeType,
    onCropComplete,
    onClose,
  ])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("cropImage")}</DialogTitle>
        </DialogHeader>
        <div className="relative h-[400px] w-full bg-muted rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("cropZoom")}</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!croppedAreaPixels || isProcessing}
          >
            {isProcessing ? t("cropProcessing") : t("cropConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
