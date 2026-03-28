import { auth } from "./auth"
import { Role } from "@/types/database"
import { redirect } from "next/navigation"

/**
 * Session tipas su role informacija
 */
export type SessionWithRole = {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: string
  }
}

/**
 * Gauna server-side session (NextAuth v5)
 */
export async function getServerSession(): Promise<SessionWithRole | null> {
  const session = await auth()
  if (!session?.user) {
    return null
  }
  return session as SessionWithRole
}

/**
 * Reikalauja autentifikacijos
 * Jei nėra session, redirect į login
 */
export async function requireAuth(): Promise<SessionWithRole> {
  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }
  return session
}

/**
 * Role hierarchija (didėjanti teisių tvarka)
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  MODERATOR: 2,
  ADMIN: 3,
}

/**
 * Patikrina ar vartotojas turi reikiamą rolę arba aukštesnę
 */
export function canAccess(userRole: string, requiredRole: Role): boolean {
  const userRoleLevel = ROLE_HIERARCHY[userRole as Role] ?? 0
  const requiredRoleLevel = ROLE_HIERARCHY[requiredRole]
  return userRoleLevel >= requiredRoleLevel
}

/**
 * Patikrina ar vartotojas turi tiksliai nurodytą rolę
 */
export function hasRole(userRole: string, role: Role): boolean {
  return userRole === role
}

/**
 * Reikalauja specifinės rolės
 * Jei neturi teisių, redirect į pagrindinį puslapį
 */
export async function requireRole(role: Role): Promise<SessionWithRole> {
  const session = await requireAuth()
  if (!canAccess(session.user.role, role)) {
    redirect("/")
  }
  return session
}

/**
 * Reikalauja ADMIN rolės
 */
export async function requireAdmin(): Promise<SessionWithRole> {
  return requireRole("ADMIN")
}

/**
 * Reikalauja MODERATOR arba ADMIN rolės
 */
export async function requireModerator(): Promise<SessionWithRole> {
  const session = await requireAuth()
  if (!canAccess(session.user.role, "MODERATOR")) {
    redirect("/")
  }
  return session
}
