import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routing } from "./lib/routing"
import { getToken } from "next-auth/jwt"
import { Role } from "./types/database"

const intlMiddleware = createMiddleware(routing)

// Role hierarchija
const ROLE_HIERARCHY: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  MODERATOR: 2,
  ADMIN: 3,
}

function canAccess(userRole: string, requiredRole: Role): boolean {
  const userRoleLevel = ROLE_HIERARCHY[userRole as Role] ?? 0
  const requiredRoleLevel = ROLE_HIERARCHY[requiredRole]
  return userRoleLevel >= requiredRoleLevel
}

export default async function middleware(request: NextRequest) {
  // Pirmiausia vykdome i18n middleware
  const response = intlMiddleware(request)

  const pathname = request.nextUrl.pathname

  // Ištraukiame locale iš pathname
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/")
  const locale = pathname.match(/^\/([a-z]{2})/)?.[1] || "lt"

  // Protected routes - reikalauja autentifikacijos
  const protectedRoutes = ["/profile", "/admin", "/moderator"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  // Auth routes - tik neautentifikuotiems
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  )

  if (isProtectedRoute || isAuthRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Jei bandoma patekti į protected route be autentifikacijos
    if (isProtectedRoute && !token) {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Jei bandoma patekti į auth route su autentifikacija
    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }

    // Role-based access control
    if (token && isProtectedRoute) {
      const userRole = (token.role as string) || "GUEST"

      // Admin routes - tik ADMIN
      if (pathnameWithoutLocale.startsWith("/admin")) {
        if (!canAccess(userRole, "ADMIN")) {
          return NextResponse.redirect(new URL(`/${locale}`, request.url))
        }
      }

      // Moderator routes - MODERATOR arba ADMIN
      if (pathnameWithoutLocale.startsWith("/moderator")) {
        if (!canAccess(userRole, "MODERATOR")) {
          return NextResponse.redirect(new URL(`/${locale}`, request.url))
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (static images from public folder)
     * - uploads (įkelti failai iš public/uploads)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|images|uploads|favicon.ico).*)",
  ],
}
