/**
 * Parodų duomenys – įvykusios ir vykstančios parodos.
 * Vėliau galima pakeisti į API arba duomenų bazės užklausą.
 */
export interface Exhibition {
  id: string
  title: string
  description?: string
  imageUrl?: string
  startDate: Date
  endDate?: Date
  location?: string
  href?: string
}

function createExhibition(
  id: string,
  title: string,
  options: Partial<Omit<Exhibition, "id" | "title">>
): Exhibition {
  return { id, title, ...options }
}

export const exhibitions: Exhibition[] = [
  createExhibition("1", "Vasaros paroda: Šiuolaikinis menas", {
    description:
      "Įvairių šiuolaikinių menininkų darbų paroda. Ekspozicijoje pristatomi tapybos, skulptūros ir instaliacijų kūriniai.",
    imageUrl: "/images/frontend/gallery.jpg",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-08-31"),
    location: "Art Vilna",
    href: "/gallery/1",
  }),
  createExhibition("2", "Impressionistų šedevrai", {
    description:
      "Klasikinių impresionistų – Monė, Renoaro, Degos – darbų paroda iš privačių kolekcijų.",
    imageUrl: "/images/frontend/artists.jpg",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-05-15"),
    location: "Art Vilna",
    href: "/gallery/2",
  }),
  createExhibition("3", "Jaunųjų menininkų atidarymas", {
    description:
      "Vilniaus meno akademijos absolventų ir studentų darbų paroda. Šiuolaikinės technikos ir tradicinių medijų sintezė.",
    startDate: new Date("2025-09-10"),
    endDate: new Date("2025-10-20"),
    location: "Art Vilna",
    href: "/gallery/3",
  }),
  createExhibition("4", "Lietuvos tapybos istorija", {
    description:
      "Retrospektyvinė paroda apimanti XIX–XX a. lietuvių dailininkų kūrybą.",
    imageUrl: "/images/frontend/education.jpg",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2025-01-31"),
    location: "Art Vilna",
  }),
  createExhibition("5", "Abstrakcijos ir forma", {
    description:
      "Geometrinės ir organinės abstrakcijos paroda – nuo Kandinskio idėjų iki šiuolaikinių interpretacijų.",
    imageUrl: "/images/frontend/shop.jpg",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-09-30"),
    location: "Art Vilna",
  }),
]

function isExhibitionActive(e: Exhibition): boolean {
  const end = e.endDate ?? e.startDate
  return end >= new Date()
}

export function getActiveExhibitions(): Exhibition[] {
  return exhibitions.filter(isExhibitionActive)
}

export function getPastExhibitions(): Exhibition[] {
  return exhibitions.filter((e) => !isExhibitionActive(e))
}

export function getExhibitionById(id: string): Exhibition | undefined {
  return exhibitions.find((e) => e.id === id)
}

export function getExhibitionsByYear(year: number): Exhibition[] {
  return exhibitions
    .filter((e) => e.startDate.getFullYear() === year)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
}

export function getAvailableExhibitionYears(): number[] {
  const years = [...new Set(exhibitions.map((e) => e.startDate.getFullYear()))]
  return years.sort((a, b) => b - a)
}
