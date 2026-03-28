// Helper funkcijos nuorodų valdymui
import { defaultNavigationLinks, NavigationLinkConfig, NavigationLocation } from "./navigation-config"
import { prisma } from "./db"

export interface NavigationLink {
  href: string
  translationKey: string
  iconName?: string
  order: number
}

/**
 * Gauna nuorodas iš duomenų bazės arba naudoja default konfigūraciją
 */
export async function getNavigationLinks(
  location: NavigationLocation
): Promise<NavigationLink[]> {
  try {
    // Bandoma gauti nuorodas iš DB
    const dbLinks = await prisma.navigationLink.findMany({
      where: {
        location,
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    })

    // Jei DB turi nuorodas, naudojame jas
    if (dbLinks.length > 0) {
      return dbLinks.map((link) => ({
        href: link.href,
        translationKey: link.translationKey,
        iconName: link.iconName || undefined,
        order: link.order,
      }))
    }

    // Jei DB neturi nuorodų, naudojame default konfigūraciją
    const defaultLinks = defaultNavigationLinks
      .filter((link) => link.location === location)
      .sort((a, b) => a.order - b.order)
      .map((link) => ({
        href: link.href,
        translationKey: link.translationKey,
        iconName: link.iconName,
        order: link.order,
      }))

    return defaultLinks
  } catch (error) {
    console.error("Error fetching navigation links:", error)
    // Fallback į default konfigūraciją
    return defaultNavigationLinks
      .filter((link) => link.location === location)
      .sort((a, b) => a.order - b.order)
      .map((link) => ({
        href: link.href,
        translationKey: link.translationKey,
        iconName: link.iconName,
        order: link.order,
      }))
  }
}

/**
 * Inicijuoja default nuorodas duomenų bazėje (jei jų nėra)
 */
export async function initializeDefaultNavigationLinks(): Promise<void> {
  try {
    const existingLinks = await prisma.navigationLink.count()
    
    if (existingLinks === 0) {
      // Sukuriame visas default nuorodas
      await prisma.navigationLink.createMany({
        data: defaultNavigationLinks.map((link) => ({
          location: link.location,
          href: link.href,
          translationKey: link.translationKey,
          iconName: link.iconName || null,
          order: link.order,
          isActive: true,
        })),
      })
      console.log("Default navigation links initialized")
    }
  } catch (error) {
    console.error("Error initializing default navigation links:", error)
  }
}

/**
 * Atnaujina nuorodą duomenų bazėje
 */
export async function updateNavigationLink(
  id: string,
  data: Partial<NavigationLinkConfig & { isActive?: boolean }>
): Promise<void> {
  await prisma.navigationLink.update({
    where: { id },
    data: {
      href: data.href,
      translationKey: data.translationKey,
      iconName: data.iconName || null,
      order: data.order,
      isActive: data.isActive,
    },
  })
}

/**
 * Sukuria naują nuorodą
 */
export async function createNavigationLink(
  data: NavigationLinkConfig & { isActive?: boolean }
): Promise<void> {
  await prisma.navigationLink.create({
    data: {
      location: data.location,
      href: data.href,
      translationKey: data.translationKey,
      iconName: data.iconName || null,
      order: data.order,
      isActive: data.isActive ?? true,
    },
  })
}

/**
 * Ištrina nuorodą
 */
export async function deleteNavigationLink(id: string): Promise<void> {
  await prisma.navigationLink.delete({
    where: { id },
  })
}

/**
 * Sinchronizuoja duomenų bazės nuorodas su default konfigūracija
 * Deaktyvuos nuorodas, kurių nėra konfigūracijoje
 * Atnaujina order numerius pagal konfigūraciją
 */
export async function syncNavigationLinksWithConfig(): Promise<void> {
  try {
    // Gauname visas nuorodas iš konfigūracijos
    const configLinks = defaultNavigationLinks

    // Gauname visas nuorodas iš DB
    const dbLinks = await prisma.navigationLink.findMany()

    // Sukuriame mapą konfigūracijos nuorodoms pagal location, href ir translationKey
    const configMap = new Map<string, NavigationLinkConfig>()
    configLinks.forEach((link) => {
      const key = `${link.location}:${link.href}:${link.translationKey}`
      configMap.set(key, link)
    })

    // Atnaujiname arba deaktyvuojame DB nuorodas
    for (const dbLink of dbLinks) {
      const key = `${dbLink.location}:${dbLink.href}:${dbLink.translationKey}`
      const configLink = configMap.get(key)

      if (configLink) {
        // Nuoroda yra konfigūracijoje - atnaujiname order ir aktyvuojame
        await prisma.navigationLink.update({
          where: { id: dbLink.id },
          data: {
            order: configLink.order,
            isActive: true,
            iconName: configLink.iconName || null,
          },
        })
      } else {
        // Nuorodos nėra konfigūracijoje - deaktyvuojame
        await prisma.navigationLink.update({
          where: { id: dbLink.id },
          data: {
            isActive: false,
          },
        })
      }
    }

    // Sukuriame naujas nuorodas, kurių nėra DB
    for (const configLink of configLinks) {
      const existingLink = await prisma.navigationLink.findFirst({
        where: {
          location: configLink.location,
          href: configLink.href,
          translationKey: configLink.translationKey,
        },
      })

      if (!existingLink) {
        await prisma.navigationLink.create({
          data: {
            location: configLink.location,
            href: configLink.href,
            translationKey: configLink.translationKey,
            iconName: configLink.iconName || null,
            order: configLink.order,
            isActive: true,
          },
        })
      }
    }

    console.log("Navigation links synchronized with config")
  } catch (error) {
    console.error("Error synchronizing navigation links:", error)
    throw error
  }
}
