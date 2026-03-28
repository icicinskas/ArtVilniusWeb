/**
 * Failo įkėlimo API Route
 * 
 * Naudojimas:
 * POST /api/upload
 * Body: FormData su 'file' lauku
 * 
 * Pavyzdys:
 * ```typescript
 * const formData = new FormData()
 * formData.append('file', file)
 * const response = await fetch('/api/upload', {
 *   method: 'POST',
 *   body: formData
 * })
 * const { url } = await response.json()
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/storage'

// Maksimalus failo dydis: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Leidžiami failų tipai
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'

    // Validacija
    if (!file) {
      return NextResponse.json(
        { error: 'Failas nerastas' },
        { status: 400 }
      )
    }

    // Patikrinkite failo dydį
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Failas per didelis. Maksimalus dydis: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Patikrinkite failo tipą
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Netinkamas failo tipas. Leidžiami: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    // Konvertuokite File į Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Įkelkite failą
    const url = await uploadFile(
      {
        buffer,
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
      },
      folder
    )

    return NextResponse.json({
      success: true,
      url,
      message: 'Failas sėkmingai įkeltas',
    })
  } catch (error) {
    console.error('Upload klaida:', error)
    return NextResponse.json(
      { error: 'Nepavyko įkelti failo', details: error instanceof Error ? error.message : 'Nežinoma klaida' },
      { status: 500 }
    )
  }
}
