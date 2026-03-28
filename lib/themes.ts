export interface ThemeItem {
  id: string
  movementId: string
  image: string
}

export const defaultThemes: ThemeItem[] = [
  { id: "renaissance", movementId: "renaissance", image: "/images/frontend/renaissance.jpg" },
  { id: "baroque", movementId: "baroque", image: "/images/frontend/baroque.jpg" },
  { id: "romanticism", movementId: "romanticism", image: "/images/frontend/romanticism.jpg" },
  { id: "impressionism", movementId: "impressionism", image: "/images/frontend/impressionism.jpg" },
  { id: "expressionism", movementId: "expressionism", image: "/images/frontend/expressionism.jpg" },
  { id: "cubism", movementId: "cubism", image: "/images/frontend/cubism.jpg" },
  { id: "surrealism", movementId: "surrealism", image: "/images/frontend/surrealism.jpg" },
  { id: "abstract-expressionism", movementId: "abstract-expressionism", image: "/images/frontend/abstractExpressionism.jpg" },
  { id: "pop-art", movementId: "pop-art", image: "/images/frontend/popArt.jpg" },
  { id: "minimalism", movementId: "minimalism", image: "/images/frontend/minimalism.jpg" },
  { id: "contemporary", movementId: "contemporary", image: "/images/frontend/contemporary.jpg" },
]
