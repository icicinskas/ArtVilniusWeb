/**
 * Švietėjiška veikla.
 * Vėliau galima pakeisti į API arba duomenų bazės užklausą.
 */
export interface EducationalActivity {
  id: string
  title: string
  description: string
  imageUrl?: string
  year: number
  href?: string
}

function createActivity(
  id: string,
  title: string,
  description: string,
  year: number,
  options: Partial<Pick<EducationalActivity, "imageUrl" | "href">> = {}
): EducationalActivity {
  return { id, title, description, year, ...options }
}

export const educationalActivities: EducationalActivity[] = [
  createActivity(
    "1",
    "Open call 2026 jauniesiems menininkams",
    "Kviečiame jaunus (iki 35 m.) vizualiųjų sričių menininkus teikti paraiškas 2026 m. parodų rengimui Vilniaus miesto galerijos „Meno niša“ erdvėse.",
    2025,
    { imageUrl: "/images/frontend/education.jpg", href: "/education" }
  ),
  createActivity(
    "2",
    "1,2 % menui",
    "Vilniaus miesto galerija „Meno niša“ įkurta 2002 metais ir yra viena aktyviausių šiuolaikinio meno galerijų Lietuvoje, eksponuojanti profesionalų šiuolaikinį meną ir organizuojanti tarptautinius renginius.",
    2025,
    { imageUrl: "/images/frontend/gallery.jpg", href: "/gallery" }
  ),
  createActivity(
    "3",
    "Meno dirbtuvės vaikams",
    "Kūrybinės dirbtuvės 7–12 metų vaikams. Išmokite įvairių meno technikų ir kūrybiškai išsireikškite.",
    2025,
    { imageUrl: "/images/frontend/education.jpg", href: "/education" }
  ),
  createActivity(
    "4",
    "Meno istorijos paskaitos",
    "Ciklas paskaitų apie įvairius meno judėjimus ir jų istoriją. Sužinokite daugiau apie Renesansą, Baroką ir šiuolaikinį meną.",
    2024,
    { imageUrl: "/images/frontend/artists.jpg" }
  ),
  createActivity(
    "5",
    "Vakariniai menininkų susitikimai",
    "Diskusijos apie meno tendencijas ir įkvėpimą. Susitikimai su vietos ir tarptautiniais menininkais.",
    2024,
    { imageUrl: "/images/frontend/gallery.jpg" }
  ),
  createActivity(
    "6",
    "Šiuolaikinio meno seminarai",
    "Seminarai studentams ir visuomenei apie šiuolaikinio meno tendencijas ir praktikas.",
    2023,
    { imageUrl: "/images/frontend/education.jpg" }
  ),
]

export function getActivitiesByYear(year: number): EducationalActivity[] {
  return educationalActivities
    .filter((a) => a.year === year)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getAvailableYears(): number[] {
  const years = [...new Set(educationalActivities.map((a) => a.year))]
  return years.sort((a, b) => b - a)
}
