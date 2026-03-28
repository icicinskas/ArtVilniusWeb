/**
 * Būsimi ir vykstantys renginiai.
 * Vėliau galima pakeisti į API arba duomenų bazės užklausą.
 */
export interface UpcomingEvent {
  id: string
  title: string
  description?: string
  imageUrl?: string
  startDate: Date
  endDate?: Date
  location?: string
  href?: string
}

function createEvent(
  id: string,
  title: string,
  options: Partial<Omit<UpcomingEvent, "id" | "title">> = {}
): UpcomingEvent {
  return { id, title, ...options }
}

export const upcomingEvents: UpcomingEvent[] = [
  createEvent("1", "Vasaros paroda: Šiuolaikinis menas", {
    description: "Įvairių šiuolaikinių menininkų darbų paroda.",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-08-31"),
    location: "Art Vilna",
    href: "/gallery",
  }),
  createEvent("2", "Meno dirbtuvės vaikams", {
    description: "Kūrybinės dirbtuvės 7–12 metų vaikams.",
    startDate: new Date("2025-03-15"),
    endDate: new Date("2025-03-15"),
    location: "Art Vilna edukacijos centras",
    href: "/education",
  }),
  createEvent("3", "Vakarinis menininkų susitikimas", {
    description: "Diskusija apie meno tendencijas ir įkvėpimą.",
    startDate: new Date("2025-04-10"),
    location: "Art Vilna",
  }),
]
