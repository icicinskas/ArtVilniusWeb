import { NextRequest, NextResponse } from "next/server"

/**
 * NextAuth error handler
 * Nukreipia į custom error puslapį su error parametru
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get("error")
  const locale = "lt" // Galite pridėti locale detection

  // Nukreipia į custom error puslapį
  const errorUrl = new URL(`/${locale}/error`, request.url)
  if (error) {
    errorUrl.searchParams.set("error", error)
  }

  return NextResponse.redirect(errorUrl)
}
