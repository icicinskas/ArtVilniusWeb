import type { Area } from "react-easy-crop"

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.setAttribute("crossOrigin", "anonymous")
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Sukuria apkarpytą paveikslėlį kaip Blob iš nurodytos srities.
 */
export async function getCroppedImg(
  imageSrc: string,
  cropArea: Area,
  mimeType: string = "image/jpeg"
): Promise<Blob> {
  const img = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Canvas 2D kontekstas neprieinamas")
  }

  canvas.width = cropArea.width
  canvas.height = cropArea.height

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Nepavyko sukurti blob"))),
      mimeType,
      0.92
    )
  })
}
