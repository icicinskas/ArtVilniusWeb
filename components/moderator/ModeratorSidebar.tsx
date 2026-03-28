"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "@/lib/routing"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Image, MessageSquare, ShoppingCart, LogOut, Home } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ModeratorSidebarProps {
  locale: string
}

export function ModeratorSidebar({ locale }: ModeratorSidebarProps) {
  const t = useTranslations("moderator")
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    const currentPath = pathname || ""
    return currentPath === href || currentPath.startsWith(href + "/")
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push(`/${locale}`)
    router.refresh()
  }

  const menuItems = [
    {
      href: `/${locale}/moderator`,
      icon: LayoutDashboard,
      label: t("dashboard"),
    },
    {
      href: `/${locale}/moderator/artworks`,
      icon: Image,
      label: t("artworks"),
    },
    {
      href: `/${locale}/moderator/comments`,
      icon: MessageSquare,
      label: t("comments"),
    },
    {
      href: `/${locale}/moderator/orders`,
      icon: ShoppingCart,
      label: t("orders"),
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t("moderatorPanel")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("contentManagement")}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    active ? "text-blue-600" : "text-gray-500"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Home className="h-5 w-5 flex-shrink-0 text-gray-500" />
            <span>{t("backToSite")}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
