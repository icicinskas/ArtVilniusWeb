"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/lib/routing"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/SidebarContext"
import { NavigationLink } from "@/lib/navigation"
import { LayoutDashboard, Shield } from "lucide-react"
import * as Icons from "lucide-react"

interface SidebarProps {
  className?: string
  navigationLinks: NavigationLink[]
  userRole?: string | null
}

// Helper funkcija ikonos komponento gavimui
function getIconComponent(iconName?: string): React.ComponentType<{ className?: string }> | undefined {
  if (!iconName) return undefined
  const IconComponent = (Icons as any)[iconName]
  return IconComponent || undefined
}

export function Sidebar({ className, navigationLinks, userRole }: SidebarProps) {
  const t = useTranslations("common")
  const tAdmin = useTranslations("admin")
  const tModerator = useTranslations("moderator")
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const isExternalHref = (href: string) => href.startsWith("http://") || href.startsWith("https://")

  // Nustatome, kurį panelį rodyti pagal vartotojo rolę
  // next-intl Link automatiškai prideda locale prie href, todėl naudojame path be locale
  const getAdminPanelHref = () => {
    if (userRole === "ADMIN") {
      return "/admin"
    } else if (userRole === "MODERATOR") {
      return "/moderator"
    }
    return null
  }

  const getPanelLabel = () => {
    if (userRole === "ADMIN") {
      return tAdmin("adminPanel")
    } else if (userRole === "MODERATOR") {
      return tModerator("moderatorPanel")
    }
    return null
  }

  const adminPanelHref = getAdminPanelHref()
  const panelLabel = getPanelLabel()
  // usePathname grąžina path be locale prefikso
  const showAdminLink = adminPanelHref && !pathname.startsWith("/admin") && !pathname.startsWith("/moderator")

  return (
    <aside
      className={cn(
        "hidden lg:block fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 shadow-sm z-50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-1">
          {navigationLinks.map((item) => {
            const Icon = getIconComponent(item.iconName)
            const external = isExternalHref(item.href)
            const active = !external && isActive(item.href)
            const name = t(item.translationKey)

            const sharedProps = {
              className: cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              ),
              title: isCollapsed ? name : undefined,
            }

            return (
              external ? (
                <a key={item.href} href={item.href} {...sharedProps}>
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        active ? "text-blue-600" : "text-gray-500"
                      )}
                    />
                  )}
                  {!isCollapsed && <span>{name}</span>}
                </a>
              ) : (
                <Link key={item.href} href={item.href} {...sharedProps}>
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        active ? "text-blue-600" : "text-gray-500"
                      )}
                    />
                  )}
                  {!isCollapsed && <span>{name}</span>}
                </Link>
              )
            )
          })}
          
          {/* Admin/Moderator panel nuoroda */}
          {showAdminLink && (
            <Link
              href={adminPanelHref}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2 border-t border-gray-200 pt-2",
                "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              title={isCollapsed ? panelLabel || undefined : undefined}
            >
              <Shield className="h-5 w-5 flex-shrink-0 text-gray-500" />
              {!isCollapsed && <span>{panelLabel}</span>}
            </Link>
          )}
        </nav>
      </div>
    </aside>
  )
}
