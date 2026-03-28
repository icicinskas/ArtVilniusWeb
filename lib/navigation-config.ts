// Konfigūracijos failas nuorodoms (fallback, jei DB nėra duomenų)
// Ikonos pavadinimai turi atitikti lucide-react ikonų pavadinimus

export type NavigationLocation = "SIDEBAR" | "HEADER" | "FOOTER"

export interface NavigationLinkConfig {
  location: NavigationLocation
  href: string
  translationKey: string
  iconName?: string
  order: number
}

// Default nuorodos konfigūracija
export const defaultNavigationLinks: NavigationLinkConfig[] = [
  // Sidebar nuorodos
  { location: "SIDEBAR", href: "/", translationKey: "home", iconName: "Home", order: 1 },
  { location: "SIDEBAR", href: "/collections", translationKey: "collections", iconName: "Building2", order: 2 },
  { location: "SIDEBAR", href: "/artists", translationKey: "artists", iconName: "Paintbrush", order: 3 },
  { location: "SIDEBAR", href: "/exhibitions", translationKey: "exhibitions", iconName: "Images", order: 4 },
  { location: "SIDEBAR", href: "/achievements", translationKey: "achievements", iconName: "Trophy", order: 5 },
  { location: "SIDEBAR", href: "/themes", translationKey: "themes", iconName: "Layers", order: 6 },
  { location: "SIDEBAR", href: "/movements", translationKey: "artMovements", iconName: "Pencil", order: 7 },
  { location: "SIDEBAR", href: "/events", translationKey: "historicalEvents", iconName: "Clock", order: 8 },
  { location: "SIDEBAR", href: "/figures", translationKey: "historicalFigures", iconName: "Users", order: 9 },
  { location: "SIDEBAR", href: "/about", translationKey: "about", iconName: "Info", order: 10 },
  { location: "SIDEBAR", href: "/activity", translationKey: "viewActivity", iconName: "Activity", order: 11 },
  { location: "SIDEBAR", href: "/feedback", translationKey: "sendFeedback", iconName: "MessageSquare", order: 12 },
  { location: "SIDEBAR", href: "/settings", translationKey: "settings", iconName: "Settings", order: 13 },
  
  // Header nuorodos
  { location: "HEADER", href: "/", translationKey: "home", order: 1 },
  { location: "HEADER", href: "/gallery", translationKey: "gallery", order: 2 },
  { location: "HEADER", href: "/shop", translationKey: "shop", order: 3 },
  { location: "HEADER", href: "/education", translationKey: "education", order: 4 },
  { location: "HEADER", href: "/about", translationKey: "about", order: 5 },
  { location: "HEADER", href: "/contact", translationKey: "contact", order: 6 },
  
  // Footer nuorodos
  { location: "FOOTER", href: "/", translationKey: "home", order: 1 },
  { location: "FOOTER", href: "/gallery", translationKey: "gallery", order: 2 },
  { location: "FOOTER", href: "/shop", translationKey: "shop", order: 3 },
  { location: "FOOTER", href: "/education", translationKey: "education", order: 4 },
  { location: "FOOTER", href: "/about", translationKey: "about", order: 5 },
  { location: "FOOTER", href: "/contact", translationKey: "contact", order: 6 },
]
