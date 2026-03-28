export interface Artist {
  id: string
  firstName: string
  lastName: string
  birthYear: number
  birthDate: string
  deathDate?: string
  artworksCount: number
  shortBio: string
  imagePool: string[]
  stories: Array<{ title: string; source: string; image: string }>
  movements: Array<{ name: string; items: number; image: string }>
  mediums: Array<{ name: string; items: number; image: string }>
  artworks: Artwork[]
}

export interface Artwork {
  id: string
  title: string
  year: number
  popularity: number
  dominantColor: string
  image: string
}

const ARTIST_IMAGE_POOL = [
  "/images/frontend/gallery.jpg",
  "/images/frontend/shop.jpg",
  "/images/frontend/education.jpg",
  "/images/frontend/artists.jpg",
]

export const ARTISTS: Artist[] = [
  {
    id: "vangogh",
    firstName: "Vincent",
    lastName: "van Gogh",
    birthYear: 1853,
    birthDate: "1853-03-30",
    deathDate: "1890-07-29",
    artworksCount: 313,
    shortBio:
      "Nyderlandų dailininkas, laikomas vienu įtakingiausių postimpresionistų.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "A New Light on Van Gogh", source: "J. Paul Getty Museum", image: ARTIST_IMAGE_POOL[0] },
      { title: "Vincent van Gogh: Chrome Yellow", source: "National Gallery", image: ARTIST_IMAGE_POOL[1] },
      { title: "Van Gogh up close", source: "Museum Folkwang", image: ARTIST_IMAGE_POOL[2] },
      { title: "Theo and Vincent", source: "Van Gogh Museum", image: ARTIST_IMAGE_POOL[3] },
    ],
    movements: [
      { name: "Post‑Impressionism", items: 2870, image: ARTIST_IMAGE_POOL[0] },
      { name: "Modern art", items: 23468, image: ARTIST_IMAGE_POOL[1] },
      { name: "Neo‑Impressionism", items: 257, image: ARTIST_IMAGE_POOL[2] },
    ],
    mediums: [
      { name: "Oil paint", items: 96699, image: ARTIST_IMAGE_POOL[0] },
      { name: "Drawing", items: 47438, image: ARTIST_IMAGE_POOL[1] },
      { name: "Graphite", items: 111433, image: ARTIST_IMAGE_POOL[2] },
      { name: "Ink", items: 192846, image: ARTIST_IMAGE_POOL[3] },
    ],
    artworks: [
      { id: "vangogh-1", title: "Starry Night", year: 1889, popularity: 98, dominantColor: "blue", image: ARTIST_IMAGE_POOL[0] },
      { id: "vangogh-2", title: "Sunflowers", year: 1888, popularity: 92, dominantColor: "yellow", image: ARTIST_IMAGE_POOL[1] },
      { id: "vangogh-3", title: "Irises", year: 1889, popularity: 80, dominantColor: "green", image: ARTIST_IMAGE_POOL[2] },
      { id: "vangogh-4", title: "The Bedroom", year: 1888, popularity: 76, dominantColor: "blue", image: ARTIST_IMAGE_POOL[3] },
      { id: "vangogh-5", title: "Wheatfield", year: 1890, popularity: 74, dominantColor: "yellow", image: ARTIST_IMAGE_POOL[0] },
      { id: "vangogh-6", title: "Self‑Portrait", year: 1889, popularity: 68, dominantColor: "green", image: ARTIST_IMAGE_POOL[1] },
      { id: "vangogh-7", title: "Olive Trees", year: 1889, popularity: 64, dominantColor: "green", image: ARTIST_IMAGE_POOL[2] },
      { id: "vangogh-8", title: "Cafe Terrace", year: 1888, popularity: 70, dominantColor: "yellow", image: ARTIST_IMAGE_POOL[3] },
      { id: "vangogh-9", title: "Harvest", year: 1888, popularity: 60, dominantColor: "green", image: ARTIST_IMAGE_POOL[0] },
      { id: "vangogh-10", title: "Night Cafe", year: 1888, popularity: 72, dominantColor: "red", image: ARTIST_IMAGE_POOL[1] },
      { id: "vangogh-11", title: "Almond Blossom", year: 1890, popularity: 66, dominantColor: "white", image: ARTIST_IMAGE_POOL[2] },
      { id: "vangogh-12", title: "The Sower", year: 1888, popularity: 58, dominantColor: "purple", image: ARTIST_IMAGE_POOL[3] },
    ],
  },
  {
    id: "monet",
    firstName: "Claude",
    lastName: "Monet",
    birthYear: 1840,
    birthDate: "1840-11-14",
    deathDate: "1926-12-05",
    artworksCount: 304,
    shortBio:
      "Prancūzų impresionistas, garsus šviesos ir spalvos tyrinėjimais.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Water Lilies", source: "Musée de l'Orangerie", image: ARTIST_IMAGE_POOL[1] },
      { title: "Impression, Sunrise", source: "Musée Marmottan", image: ARTIST_IMAGE_POOL[2] },
    ],
    movements: [
      { name: "Impressionism", items: 6100, image: ARTIST_IMAGE_POOL[1] },
      { name: "Modern art", items: 23468, image: ARTIST_IMAGE_POOL[2] },
    ],
    mediums: [
      { name: "Oil paint", items: 96699, image: ARTIST_IMAGE_POOL[0] },
      { name: "Watercolor", items: 21400, image: ARTIST_IMAGE_POOL[1] },
    ],
    artworks: [
      { id: "monet-1", title: "Water Lilies", year: 1916, popularity: 90, dominantColor: "blue", image: ARTIST_IMAGE_POOL[1] },
      { id: "monet-2", title: "Impression, Sunrise", year: 1872, popularity: 96, dominantColor: "orange", image: ARTIST_IMAGE_POOL[2] },
      { id: "monet-3", title: "Haystacks", year: 1890, popularity: 78, dominantColor: "yellow", image: ARTIST_IMAGE_POOL[3] },
      { id: "monet-4", title: "Japanese Bridge", year: 1899, popularity: 74, dominantColor: "green", image: ARTIST_IMAGE_POOL[0] },
      { id: "monet-5", title: "Rouen Cathedral", year: 1894, popularity: 70, dominantColor: "blue", image: ARTIST_IMAGE_POOL[1] },
      { id: "monet-6", title: "Poppies", year: 1873, popularity: 68, dominantColor: "red", image: ARTIST_IMAGE_POOL[2] },
      { id: "monet-7", title: "The Artist's Garden", year: 1900, popularity: 66, dominantColor: "green", image: ARTIST_IMAGE_POOL[3] },
      { id: "monet-8", title: "Seine at Giverny", year: 1897, popularity: 62, dominantColor: "blue", image: ARTIST_IMAGE_POOL[0] },
    ],
  },
  {
    id: "banksy",
    firstName: "Banksy",
    lastName: "Banksy",
    birthYear: 1974,
    birthDate: "1974-01-01",
    artworksCount: 44,
    shortBio:
      "Gatvės meno kūrėjas, žinomas dėl socialinių ir politinių komentarų.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Street art icons", source: "Urban Art Museum", image: ARTIST_IMAGE_POOL[2] },
    ],
    movements: [
      { name: "Street art", items: 5400, image: ARTIST_IMAGE_POOL[3] },
    ],
    mediums: [
      { name: "Spray paint", items: 9800, image: ARTIST_IMAGE_POOL[3] },
    ],
    artworks: [
      { id: "banksy-1", title: "Girl with Balloon", year: 2002, popularity: 92, dominantColor: "red", image: ARTIST_IMAGE_POOL[2] },
      { id: "banksy-2", title: "Flower Thrower", year: 2003, popularity: 88, dominantColor: "green", image: ARTIST_IMAGE_POOL[1] },
      { id: "banksy-3", title: "Mobile Lovers", year: 2014, popularity: 72, dominantColor: "blue", image: ARTIST_IMAGE_POOL[0] },
      { id: "banksy-4", title: "Love is in the Air", year: 2003, popularity: 80, dominantColor: "black", image: ARTIST_IMAGE_POOL[3] },
      { id: "banksy-5", title: "Rage, Flower Thrower", year: 2005, popularity: 70, dominantColor: "yellow", image: ARTIST_IMAGE_POOL[2] },
      { id: "banksy-6", title: "Sweep It Under the Carpet", year: 2006, popularity: 66, dominantColor: "gray", image: ARTIST_IMAGE_POOL[1] },
    ],
  },
  {
    id: "rembrandt",
    firstName: "Rembrandt",
    lastName: "van Rijn",
    birthYear: 1606,
    birthDate: "1606-07-15",
    deathDate: "1669-10-04",
    artworksCount: 2150,
    shortBio:
      "Olandų aukso amžiaus dailininkas, garsus portretais ir ofortais.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Self‑portraits", source: "Rijksmuseum", image: ARTIST_IMAGE_POOL[0] },
    ],
    movements: [
      { name: "Baroque", items: 4200, image: ARTIST_IMAGE_POOL[1] },
    ],
    mediums: [
      { name: "Etching", items: 13000, image: ARTIST_IMAGE_POOL[2] },
    ],
    artworks: [
      { id: "rembrandt-1", title: "Night Watch", year: 1642, popularity: 96, dominantColor: "brown", image: ARTIST_IMAGE_POOL[0] },
      { id: "rembrandt-2", title: "Self‑Portrait", year: 1659, popularity: 90, dominantColor: "brown", image: ARTIST_IMAGE_POOL[1] },
      { id: "rembrandt-3", title: "The Jewish Bride", year: 1667, popularity: 82, dominantColor: "red", image: ARTIST_IMAGE_POOL[2] },
      { id: "rembrandt-4", title: "Bathsheba", year: 1654, popularity: 76, dominantColor: "gold", image: ARTIST_IMAGE_POOL[3] },
      { id: "rembrandt-5", title: "The Syndics", year: 1662, popularity: 74, dominantColor: "black", image: ARTIST_IMAGE_POOL[0] },
    ],
  },
  {
    id: "raphael",
    firstName: "Raphael",
    lastName: "Sanzio",
    birthYear: 1483,
    birthDate: "1483-04-06",
    deathDate: "1520-04-06",
    artworksCount: 159,
    shortBio:
      "Italų renesanso meistras, garsus Madonos ir freskų ciklais.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "The School of Athens", source: "Vatican Museums", image: ARTIST_IMAGE_POOL[1] },
    ],
    movements: [
      { name: "Renaissance", items: 7800, image: ARTIST_IMAGE_POOL[0] },
    ],
    mediums: [
      { name: "Fresco", items: 4200, image: ARTIST_IMAGE_POOL[1] },
    ],
    artworks: [
      { id: "raphael-1", title: "School of Athens", year: 1511, popularity: 92, dominantColor: "blue", image: ARTIST_IMAGE_POOL[1] },
      { id: "raphael-2", title: "Sistine Madonna", year: 1513, popularity: 88, dominantColor: "red", image: ARTIST_IMAGE_POOL[2] },
      { id: "raphael-3", title: "Transfiguration", year: 1520, popularity: 80, dominantColor: "gold", image: ARTIST_IMAGE_POOL[3] },
      { id: "raphael-4", title: "The Alba Madonna", year: 1510, popularity: 72, dominantColor: "green", image: ARTIST_IMAGE_POOL[0] },
    ],
  },
  {
    id: "cezanne",
    firstName: "Paul",
    lastName: "Cézanne",
    birthYear: 1839,
    birthDate: "1839-01-19",
    deathDate: "1906-10-22",
    artworksCount: 154,
    shortBio:
      "Prancūzų tapytojas, laikomas kubizmo pirmtaku.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Mont Sainte‑Victoire", source: "Musée d'Orsay", image: ARTIST_IMAGE_POOL[2] },
    ],
    movements: [
      { name: "Post‑Impressionism", items: 2870, image: ARTIST_IMAGE_POOL[3] },
    ],
    mediums: [
      { name: "Oil paint", items: 96699, image: ARTIST_IMAGE_POOL[0] },
    ],
    artworks: [
      { id: "cezanne-1", title: "Mont Sainte‑Victoire", year: 1902, popularity: 84, dominantColor: "blue", image: ARTIST_IMAGE_POOL[2] },
      { id: "cezanne-2", title: "The Card Players", year: 1892, popularity: 78, dominantColor: "brown", image: ARTIST_IMAGE_POOL[3] },
      { id: "cezanne-3", title: "Still Life with Apples", year: 1895, popularity: 72, dominantColor: "red", image: ARTIST_IMAGE_POOL[0] },
      { id: "cezanne-4", title: "Bathers", year: 1898, popularity: 68, dominantColor: "blue", image: ARTIST_IMAGE_POOL[1] },
    ],
  },
  {
    id: "durer",
    firstName: "Albrecht",
    lastName: "Dürer",
    birthYear: 1471,
    birthDate: "1471-05-21",
    deathDate: "1528-04-06",
    artworksCount: 2110,
    shortBio:
      "Vokiečių renesanso dailininkas, garsus graviūromis.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Melencolia I", source: "British Museum", image: ARTIST_IMAGE_POOL[0] },
    ],
    movements: [
      { name: "Renaissance", items: 7800, image: ARTIST_IMAGE_POOL[1] },
    ],
    mediums: [
      { name: "Engraving", items: 8200, image: ARTIST_IMAGE_POOL[2] },
    ],
    artworks: [
      { id: "durer-1", title: "Melencolia I", year: 1514, popularity: 86, dominantColor: "gray", image: ARTIST_IMAGE_POOL[0] },
      { id: "durer-2", title: "Young Hare", year: 1502, popularity: 82, dominantColor: "brown", image: ARTIST_IMAGE_POOL[1] },
      { id: "durer-3", title: "Knight, Death, Devil", year: 1513, popularity: 80, dominantColor: "black", image: ARTIST_IMAGE_POOL[2] },
      { id: "durer-4", title: "Adam and Eve", year: 1504, popularity: 74, dominantColor: "beige", image: ARTIST_IMAGE_POOL[3] },
    ],
  },
  {
    id: "gauguin",
    firstName: "Paul",
    lastName: "Gauguin",
    birthYear: 1848,
    birthDate: "1848-06-07",
    deathDate: "1903-05-08",
    artworksCount: 457,
    shortBio:
      "Postimpresionistas, garsus Tahiti laikotarpio kūriniais.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Tahitian visions", source: "Musée d'Orsay", image: ARTIST_IMAGE_POOL[3] },
    ],
    movements: [
      { name: "Post‑Impressionism", items: 2870, image: ARTIST_IMAGE_POOL[0] },
    ],
    mediums: [
      { name: "Oil paint", items: 96699, image: ARTIST_IMAGE_POOL[1] },
    ],
    artworks: [
      { id: "gauguin-1", title: "Where Do We Come From", year: 1897, popularity: 88, dominantColor: "green", image: ARTIST_IMAGE_POOL[3] },
      { id: "gauguin-2", title: "The Yellow Christ", year: 1889, popularity: 76, dominantColor: "yellow", image: ARTIST_IMAGE_POOL[2] },
      { id: "gauguin-3", title: "Tahitian Women", year: 1891, popularity: 72, dominantColor: "blue", image: ARTIST_IMAGE_POOL[0] },
      { id: "gauguin-4", title: "Spirit of the Dead", year: 1892, popularity: 70, dominantColor: "purple", image: ARTIST_IMAGE_POOL[1] },
    ],
  },
  {
    id: "klimt",
    firstName: "Gustav",
    lastName: "Klimt",
    birthYear: 1862,
    birthDate: "1862-07-14",
    deathDate: "1918-02-06",
    artworksCount: 564,
    shortBio:
      "Austrų simbolistas, secesijos judėjimo ikona.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "The Kiss", source: "Belvedere Museum", image: ARTIST_IMAGE_POOL[2] },
    ],
    movements: [
      { name: "Symbolism", items: 1900, image: ARTIST_IMAGE_POOL[1] },
    ],
    mediums: [
      { name: "Gold leaf", items: 480, image: ARTIST_IMAGE_POOL[3] },
    ],
    artworks: [
      { id: "klimt-1", title: "The Kiss", year: 1908, popularity: 94, dominantColor: "gold", image: ARTIST_IMAGE_POOL[2] },
      { id: "klimt-2", title: "Adele Bloch‑Bauer I", year: 1907, popularity: 90, dominantColor: "gold", image: ARTIST_IMAGE_POOL[1] },
      { id: "klimt-3", title: "The Tree of Life", year: 1905, popularity: 82, dominantColor: "green", image: ARTIST_IMAGE_POOL[0] },
      { id: "klimt-4", title: "Danaë", year: 1907, popularity: 74, dominantColor: "purple", image: ARTIST_IMAGE_POOL[3] },
    ],
  },
  {
    id: "goya",
    firstName: "Francisco",
    lastName: "Goya",
    birthYear: 1746,
    birthDate: "1746-03-30",
    deathDate: "1828-04-16",
    artworksCount: 1280,
    shortBio:
      "Ispanų romantizmo dailininkas, garsus portretais ir grafika.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "The Third of May", source: "Prado Museum", image: ARTIST_IMAGE_POOL[1] },
    ],
    movements: [
      { name: "Romanticism", items: 2400, image: ARTIST_IMAGE_POOL[2] },
    ],
    mediums: [
      { name: "Etching", items: 13000, image: ARTIST_IMAGE_POOL[3] },
    ],
    artworks: [
      { id: "goya-1", title: "The Third of May", year: 1808, popularity: 90, dominantColor: "black", image: ARTIST_IMAGE_POOL[1] },
      { id: "goya-2", title: "Saturn", year: 1823, popularity: 84, dominantColor: "black", image: ARTIST_IMAGE_POOL[2] },
      { id: "goya-3", title: "Maja", year: 1800, popularity: 78, dominantColor: "beige", image: ARTIST_IMAGE_POOL[0] },
      { id: "goya-4", title: "The Family of Charles IV", year: 1800, popularity: 76, dominantColor: "red", image: ARTIST_IMAGE_POOL[3] },
    ],
  },
  {
    id: "tezuka",
    firstName: "Osamu",
    lastName: "Tezuka",
    birthYear: 1928,
    birthDate: "1928-11-03",
    deathDate: "1989-02-09",
    artworksCount: 104,
    shortBio:
      "Japonų menininkas, vadinamas „mangos tėvu“.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Manga revolution", source: "Kyoto Museum", image: ARTIST_IMAGE_POOL[0] },
    ],
    movements: [
      { name: "Manga", items: 9800, image: ARTIST_IMAGE_POOL[1] },
    ],
    mediums: [
      { name: "Ink", items: 192846, image: ARTIST_IMAGE_POOL[2] },
    ],
    artworks: [
      { id: "tezuka-1", title: "Astro Boy", year: 1952, popularity: 86, dominantColor: "blue", image: ARTIST_IMAGE_POOL[0] },
      { id: "tezuka-2", title: "Black Jack", year: 1973, popularity: 78, dominantColor: "black", image: ARTIST_IMAGE_POOL[1] },
      { id: "tezuka-3", title: "Phoenix", year: 1967, popularity: 72, dominantColor: "red", image: ARTIST_IMAGE_POOL[2] },
      { id: "tezuka-4", title: "Kimba", year: 1950, popularity: 70, dominantColor: "white", image: ARTIST_IMAGE_POOL[3] },
    ],
  },
  {
    id: "jr",
    firstName: "JR",
    lastName: "JR",
    birthYear: 1983,
    birthDate: "1983-02-22",
    artworksCount: 67,
    shortBio:
      "Prancūzų menininkas, kuriantis viešose erdvėse didelio formato darbus.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "City portraits", source: "Urban Art Museum", image: ARTIST_IMAGE_POOL[3] },
    ],
    movements: [
      { name: "Street art", items: 5400, image: ARTIST_IMAGE_POOL[0] },
    ],
    mediums: [
      { name: "Photography", items: 4200, image: ARTIST_IMAGE_POOL[1] },
    ],
    artworks: [
      { id: "jr-1", title: "Women Are Heroes", year: 2008, popularity: 80, dominantColor: "black", image: ARTIST_IMAGE_POOL[3] },
      { id: "jr-2", title: "Inside Out", year: 2011, popularity: 74, dominantColor: "gray", image: ARTIST_IMAGE_POOL[2] },
      { id: "jr-3", title: "The Wrinkles", year: 2008, popularity: 70, dominantColor: "white", image: ARTIST_IMAGE_POOL[1] },
    ],
  },
  {
    id: "okeeffe",
    firstName: "Georgia",
    lastName: "O'Keeffe",
    birthYear: 1887,
    birthDate: "1887-11-15",
    deathDate: "1986-03-06",
    artworksCount: 126,
    shortBio:
      "Amerikiečių modernistė, garsėjanti didelio mastelio gėlių motyvais.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Desert landscapes", source: "MoMA", image: ARTIST_IMAGE_POOL[2] },
    ],
    movements: [
      { name: "Modernism", items: 4200, image: ARTIST_IMAGE_POOL[3] },
    ],
    mediums: [
      { name: "Oil paint", items: 96699, image: ARTIST_IMAGE_POOL[0] },
    ],
    artworks: [
      { id: "okeeffe-1", title: "Jimson Weed", year: 1936, popularity: 86, dominantColor: "white", image: ARTIST_IMAGE_POOL[2] },
      { id: "okeeffe-2", title: "Black Iris", year: 1926, popularity: 80, dominantColor: "black", image: ARTIST_IMAGE_POOL[3] },
      { id: "okeeffe-3", title: "Sky Above Clouds", year: 1965, popularity: 74, dominantColor: "blue", image: ARTIST_IMAGE_POOL[1] },
      { id: "okeeffe-4", title: "Red Canna", year: 1924, popularity: 70, dominantColor: "red", image: ARTIST_IMAGE_POOL[0] },
    ],
  },
  {
    id: "botero",
    firstName: "Fernando",
    lastName: "Botero",
    birthYear: 1932,
    birthDate: "1932-04-19",
    deathDate: "2023-09-15",
    artworksCount: 112,
    shortBio:
      "Kolumbijos menininkas, atpažįstamas iš apvalių formų stilistikos.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Voluminous figures", source: "Museo Botero", image: ARTIST_IMAGE_POOL[1] },
    ],
    movements: [
      { name: "Contemporary", items: 3200, image: ARTIST_IMAGE_POOL[2] },
    ],
    mediums: [
      { name: "Sculpture", items: 8600, image: ARTIST_IMAGE_POOL[3] },
    ],
    artworks: [
      { id: "botero-1", title: "The Musicians", year: 1980, popularity: 78, dominantColor: "red", image: ARTIST_IMAGE_POOL[1] },
      { id: "botero-2", title: "Dancers", year: 1987, popularity: 72, dominantColor: "orange", image: ARTIST_IMAGE_POOL[0] },
      { id: "botero-3", title: "Still Life with Fruits", year: 1995, popularity: 66, dominantColor: "green", image: ARTIST_IMAGE_POOL[2] },
    ],
  },
  {
    id: "fairey",
    firstName: "Shepard",
    lastName: "Fairey",
    birthYear: 1970,
    birthDate: "1970-02-15",
    artworksCount: 32,
    shortBio:
      "Amerikiečių grafikos dizaineris ir gatvės meno kūrėjas.",
    imagePool: ARTIST_IMAGE_POOL,
    stories: [
      { title: "Obey campaign", source: "Design Museum", image: ARTIST_IMAGE_POOL[0] },
    ],
    movements: [
      { name: "Street art", items: 5400, image: ARTIST_IMAGE_POOL[1] },
    ],
    mediums: [
      { name: "Poster art", items: 7300, image: ARTIST_IMAGE_POOL[2] },
    ],
    artworks: [
      { id: "fairey-1", title: "Hope", year: 2008, popularity: 90, dominantColor: "blue", image: ARTIST_IMAGE_POOL[0] },
      { id: "fairey-2", title: "Obey Giant", year: 1990, popularity: 80, dominantColor: "red", image: ARTIST_IMAGE_POOL[1] },
      { id: "fairey-3", title: "Supply & Demand", year: 2010, popularity: 68, dominantColor: "black", image: ARTIST_IMAGE_POOL[2] },
    ],
  },
]

const hashString = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000
  }
  return hash
}

export const getArtistImage = (artist: Artist) => {
  const hash = hashString(`${artist.id}-${artist.lastName}`)
  return artist.imagePool[hash % artist.imagePool.length]
}

export const getArtistLabel = (artist: Artist) =>
  `${artist.firstName} ${artist.lastName}`

export const getArtistById = (id: string) =>
  ARTISTS.find((artist) => artist.id === id)

export const getArtistYears = () =>
  Array.from(new Set(ARTISTS.map((artist) => artist.birthYear))).sort(
    (a, b) => a - b
  )
