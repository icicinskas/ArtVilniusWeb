export type MovementEra = "pre19" | "19" | "20" | "contemporary"

export type Movement = {
  id: string
  era: MovementEra
  impactScore: number
  startYear: number
  endYear: number
  image?: string
}

export const MOVEMENTS: Movement[] = [
  {
    id: "renaissance",
    era: "pre19",
    impactScore: 90,
    startYear: 1350,
    endYear: 1600,
    image: "/images/frontend/renaissance.jpg",
  },
  {
    id: "baroque",
    era: "pre19",
    impactScore: 84,
    startYear: 1600,
    endYear: 1750,
    image: "/images/frontend/baroque.jpg",
  },
  {
    id: "romanticism",
    era: "19",
    impactScore: 78,
    startYear: 1780,
    endYear: 1850,
    image: "/images/frontend/romanticism.jpg",
  },
  {
    id: "impressionism",
    era: "19",
    impactScore: 88,
    startYear: 1860,
    endYear: 1890,
    image: "/images/frontend/impressionism.jpg",
  },
  {
    id: "expressionism",
    era: "20",
    impactScore: 82,
    startYear: 1905,
    endYear: 1930,
    image: "/images/frontend/expressionism.jpg",
  },
  {
    id: "cubism",
    era: "20",
    impactScore: 91,
    startYear: 1907,
    endYear: 1917,
    image: "/images/frontend/cubism.jpg",
  },
  {
    id: "surrealism",
    era: "20",
    impactScore: 86,
    startYear: 1920,
    endYear: 1940,
    image: "/images/frontend/surrealism.jpg",
  },
  {
    id: "abstract-expressionism",
    era: "20",
    impactScore: 89,
    startYear: 1940,
    endYear: 1960,
    image: "/images/frontend/abstractExpressionism.jpg",
  },
  {
    id: "pop-art",
    era: "20",
    impactScore: 83,
    startYear: 1950,
    endYear: 1970,
    image: "/images/frontend/popArt.jpg",
  },
  {
    id: "minimalism",
    era: "20",
    impactScore: 75,
    startYear: 1960,
    endYear: 1980,
    image: "/images/frontend/minimalism.jpg",
  },
  {
    id: "contemporary",
    era: "contemporary",
    impactScore: 92,
    startYear: 1980,
    endYear: 2030,
    image: "/images/frontend/contemporary.jpg",
  },
]

export const getMovementById = (movementId: string) =>
  MOVEMENTS.find((movement) => movement.id === movementId) ?? null
