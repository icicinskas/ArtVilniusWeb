// Server component wrapper, kuris gauna nuorodas ir perduoda jas client komponentui
import { Sidebar } from "./Sidebar"
import { getNavigationLinks } from "@/lib/navigation"
import { defaultNavigationLinks } from "@/lib/navigation-config"
import { getServerSession } from "@/lib/session"

export async function SidebarWrapper() {
  const navigationLinks = await getNavigationLinks("SIDEBAR")
  const session = await getServerSession()
  const userRole = session?.user?.role || null

  const canSeeSettings = userRole === "ADMIN" || userRole === "MODERATOR"
  const filteredLinks = (canSeeSettings
    ? navigationLinks
    : navigationLinks.filter((link) => link.href !== "/settings")
  ).filter(
    (link) =>
      link.translationKey !== "places" &&
      link.href !== "/places" &&
      link.translationKey !== "nearby" &&
      link.href !== "/nearby"
  )

  const sidebarOrderMap = new Map(
    defaultNavigationLinks
      .filter((link) => link.location === "SIDEBAR")
      .map((link) => [link.translationKey, link.order])
  )

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    const orderA = sidebarOrderMap.get(a.translationKey) ?? a.order
    const orderB = sidebarOrderMap.get(b.translationKey) ?? b.order
    return orderA - orderB
  })

  return <Sidebar navigationLinks={sortedLinks} userRole={userRole} />
}
