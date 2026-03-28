/**
 * Duomenų bazės tipai
 * 
 * SQLite nepalaiko enum tipų, todėl naudojame String su konstantomis
 */

// Role tipai
export type Role = "GUEST" | "USER" | "MODERATOR" | "ADMIN"

export const Role = {
  GUEST: "GUEST" as const,
  USER: "USER" as const,
  MODERATOR: "MODERATOR" as const,
  ADMIN: "ADMIN" as const,
} as const

// OrderStatus tipai
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export const OrderStatus = {
  PENDING: "PENDING" as const,
  PROCESSING: "PROCESSING" as const,
  SHIPPED: "SHIPPED" as const,
  DELIVERED: "DELIVERED" as const,
  CANCELLED: "CANCELLED" as const,
} as const

// Favorite target tipai
export type FavoriteTargetType = "ARTIST" | "ARTWORK"

export const FavoriteTargetType = {
  ARTIST: "ARTIST" as const,
  ARTWORK: "ARTWORK" as const,
} as const

/**
 * Patikrina, ar string yra validus Role
 */
export function isValidRole(value: string): value is Role {
  return ["GUEST", "USER", "MODERATOR", "ADMIN"].includes(value)
}

/**
 * Patikrina, ar string yra validus OrderStatus
 */
export function isValidOrderStatus(value: string): value is OrderStatus {
  return ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(value)
}

/**
 * Patikrina, ar string yra validus FavoriteTargetType
 */
export function isValidFavoriteTargetType(
  value: string
): value is FavoriteTargetType {
  return ["ARTIST", "ARTWORK"].includes(value)
}
