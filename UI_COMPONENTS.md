# UI Komponentų Dokumentacija

## Apžvalga

Šis dokumentas aprašo visus sukurtus UI komponentus ArtVilnius Web projekte. Komponentai yra sukurti pagal SOLID ir KISS principus, naudojant TypeScript, React, Tailwind CSS ir Radix UI.

## Struktūra

```
components/
├── ui/              # Baziniai UI komponentai
├── gallery/         # Galerijos komponentai
├── shop/            # Parduotuvės komponentai
├── education/       # Švietimo komponentai
├── contact/         # Kontaktų komponentai
├── auth/            # Autentifikacijos komponentai
└── layout/          # Layout komponentai
```

---

## Baziniai UI Komponentai

### Card (`components/ui/card.tsx`)

**Aprašymas**: Universalus kortelės komponentas su header, content ir footer sekcijomis.

**Naudojimas**:
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Pavadinimas</CardTitle>
  </CardHeader>
  <CardContent>
    Turinys
  </CardContent>
  <CardFooter>
    Veiksmai
  </CardFooter>
</Card>
```

**Taisyklės**:
- Naudokite `CardHeader` tik tada, kai reikia header sekcijos
- `CardContent` yra pagrindinė turinio sekcija
- `CardFooter` naudokite veiksmų mygtukams arba papildomai informacijai

---

### Badge (`components/ui/badge.tsx`)

**Aprašymas**: Mažas ženklelis teksto žymėjimui.

**Variantai**: `default`, `secondary`, `destructive`, `outline`

**Naudojimas**:
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="outline">Kategorija</Badge>
<Badge variant="secondary">Technika</Badge>
```

**Taisyklės**:
- Naudokite `outline` variantą neutraliems žymėjimams
- `secondary` - papildomai informacijai
- `destructive` - svarbiems arba neigiamiems žymėjimams

---

### Dialog (`components/ui/dialog.tsx`)

**Aprašymas**: Modal dialogo komponentas, pagrįstas Radix UI.

**Naudojimas**:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Pavadinimas</DialogTitle>
    </DialogHeader>
    Turinys
    <DialogFooter>
      Veiksmai
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Taisyklės**:
- Visada naudokite `DialogHeader` su `DialogTitle`
- `DialogFooter` naudokite veiksmų mygtukams
- Dialog automatiškai uždaro paspaudus Escape arba už dialogo ribų

---

### Select (`components/ui/select.tsx`)

**Aprašymas**: Dropdown pasirinkimo komponentas.

**Naudojimas**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Pasirinkite..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Taisyklės**:
- Visada naudokite `SelectValue` su placeholder
- `SelectItem` reikšmės turi būti unikalios

---

### Textarea (`components/ui/textarea.tsx`)

**Aprašymas**: Teksto įvedimo laukas ilgesniam tekstui.

**Naudojimas**:
```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Jūsų tekstas..." />
```

**Taisyklės**:
- Naudokite `min-h-[80px]` arba didesnį aukštį ilgesniam tekstui
- Visada pridėkite `placeholder` tekstą

---

### Separator (`components/ui/separator.tsx`)

**Aprašymas**: Horizontali arba vertikali atskyrimo linija.

**Naudojimas**:
```tsx
import { Separator } from "@/components/ui/separator"

<Separator />
<Separator orientation="vertical" />
```

---

## Galerijos Komponentai

### ArtworkCard (`components/gallery/ArtworkCard.tsx`)

**Aprašymas**: Paveikslų kortelė su vaizdu, informacija ir veiksmų mygtukais.

**Props**:
- `artwork: Artwork` - Paveikslo duomenys
- `onView?: (artwork: Artwork) => void` - Callback atidarant peržiūrą
- `onFavorite?: (artwork: Artwork) => void` - Callback pridėjimui prie mėgstamiausių
- `isFavorite?: boolean` - Ar paveikslas yra mėgstamiausiuose
- `showWatermark?: boolean` - Rodyti vandens ženklą (svečiams)
- `className?: string` - Papildomi CSS klasės

**Naudojimas**:
```tsx
import { ArtworkCard } from "@/components/gallery/ArtworkCard"

<ArtworkCard
  artwork={artwork}
  onView={(artwork) => openLightbox(artwork)}
  onFavorite={(artwork) => toggleFavorite(artwork)}
  isFavorite={isFavorite}
  showWatermark={!isAuthenticated}
/>
```

**Taisyklės**:
- Visada naudokite `onView` callback lightbox atidarymui
- `showWatermark` turėtų būti `true` tik svečiams
- Kortelė automatiškai pritaiko paveikslą su `object-cover`
- Hover efektas padidina paveikslą (`scale-105`)

---

### GalleryFilter (`components/gallery/GalleryFilter.tsx`)

**Aprašymas**: Filtravimo komponentas su paieška, kategorijomis, technikomis ir kainų diapazonu.

**Props**:
- `categories?: string[]` - Galimos kategorijos
- `techniques?: string[]` - Galimos technikos
- `onFilterChange?: (filters: FilterOptions) => void` - Callback filtrams keičiantis
- `className?: string` - Papildomi CSS klasės

**Naudojimas**:
```tsx
import { GalleryFilter } from "@/components/gallery/GalleryFilter"

<GalleryFilter
  categories={["Tapyba", "Grafika", "Skulptūra"]}
  techniques={["Olios tapyba", "Akvarelė"]}
  onFilterChange={(filters) => applyFilters(filters)}
/>
```

**Taisyklės**:
- Filtrai automatiškai atnaujina URL query parametrus
- Naudokite `onFilterChange` callback, kad sinchronizuotumėte su duomenų baze
- "Išvalyti" mygtukas rodomas tik kai yra aktyvių filtrų

---

### GallerySearch (`components/gallery/GallerySearch.tsx`)

**Aprašymas**: Paieškos laukas su ikona ir išvalymo mygtuku.

**Props**:
- `onSearch?: (query: string) => void` - Callback paieškai
- `className?: string` - Papildomi CSS klasės
- `placeholder?: string` - Placeholder tekstas

**Naudojimas**:
```tsx
import { GallerySearch } from "@/components/gallery/GallerySearch"

<GallerySearch
  onSearch={(query) => performSearch(query)}
  placeholder="Ieškoti paveikslų..."
/>
```

**Taisyklės**:
- Paieška automatiškai atnaujina URL query parametrus
- Išvalymo mygtukas rodomas tik kai yra teksto

---

### Lightbox (`components/gallery/Lightbox.tsx`)

**Aprašymas**: Pilno ekrano paveikslų peržiūros modalas su navigacija.

**Props**:
- `artwork: Artwork | null` - Paveikslo duomenys
- `isOpen: boolean` - Ar modalas atidarytas
- `onClose: () => void` - Callback uždarymui
- `onPrevious?: () => void` - Callback ankstesniam paveikslui
- `onNext?: () => void` - Callback kitam paveikslui
- `onFavorite?: (artwork: Artwork) => void` - Callback mėgstamiausiems
- `isFavorite?: boolean` - Ar paveikslas mėgstamiausiuose
- `hasNext?: boolean` - Ar yra kitas paveikslas
- `hasPrevious?: boolean` - Ar yra ankstesnis paveikslas
- `showWatermark?: boolean` - Rodyti vandens ženklą

**Naudojimas**:
```tsx
import { Lightbox } from "@/components/gallery/Lightbox"

<Lightbox
  artwork={selectedArtwork}
  isOpen={isLightboxOpen}
  onClose={() => setIsLightboxOpen(false)}
  onPrevious={() => navigateToPrevious()}
  onNext={() => navigateToNext()}
  hasNext={currentIndex < artworks.length - 1}
  hasPrevious={currentIndex > 0}
  showWatermark={!isAuthenticated}
/>
```

**Taisyklės**:
- Klaviatūros navigacija: `ArrowLeft`, `ArrowRight`, `Escape`
- Paveikslas rodomas su `object-contain` kad būtų matomas visas
- Informacijos sekcija rodo visą paveikslo informaciją
- Naudokite `showWatermark` svečiams

---

## Parduotuvės Komponentai

### ProductCard (`components/shop/ProductCard.tsx`)

**Aprašymas**: Produkto kortelė parduotuvėje su kaina ir "Į krepšelį" mygtuku.

**Props**:
- `product: Artwork` - Produkto duomenys (turi būti `isForSale: true`)
- `onAddToCart?: (product: Artwork) => void` - Callback pridėjimui į krepšelį
- `onFavorite?: (product: Artwork) => void` - Callback mėgstamiausiems
- `isFavorite?: boolean` - Ar produktas mėgstamiausiuose
- `className?: string` - Papildomi CSS klasės

**Naudojimas**:
```tsx
import { ProductCard } from "@/components/shop/ProductCard"

<ProductCard
  product={product}
  onAddToCart={(product) => addToCart(product)}
  onFavorite={(product) => toggleFavorite(product)}
  isFavorite={isFavorite}
/>
```

**Taisyklės**:
- Komponentas grąžina `null` jei produktas nėra parduodamas
- Visada rodo kainą su dviem skaičiais po kablelio
- "Į krepšelį" mygtukas turėtų būti aiškiai matomas

---

### ShoppingCart (`components/shop/ShoppingCart.tsx`)

**Aprašymas**: Krepšelio modalas su prekių sąrašu ir bendra suma.

**Props**:
- `items: CartItem[]` - Krepšelio prekės
- `isOpen: boolean` - Ar modalas atidarytas
- `onClose: () => void` - Callback uždarymui
- `onRemoveItem?: (artworkId: string) => void` - Callback prekės pašalinimui
- `onUpdateQuantity?: (artworkId: string, quantity: number) => void` - Callback kiekio keitimui
- `onCheckout?: () => void` - Callback apmokėjimui

**Naudojimas**:
```tsx
import { ShoppingCart } from "@/components/shop/ShoppingCart"

<ShoppingCart
  items={cartItems}
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  onRemoveItem={(id) => removeFromCart(id)}
  onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
  onCheckout={() => navigateToCheckout()}
/>
```

**Taisyklės**:
- Automatiškai skaičiuoja bendrą sumą su PVM (21%)
- Kiekio keitimas turėtų būti apribotas nuo 1 iki maksimumo
- Tuščias krepšelis rodo informacinį pranešimą

---

## Švietimo Komponentai

### ArticleCard (`components/education/ArticleCard.tsx`)

**Aprašymas**: Straipsnio kortelė su vaizdu, aprašymu ir metaduomenimis.

**Props**:
- `article: Article` - Straipsnio duomenys
- `onReadMore?: (article: Article) => void` - Callback skaitymui
- `className?: string` - Papildomi CSS klasės

**Article Interface**:
```typescript
interface Article {
  id: string
  title: string
  excerpt?: string
  content?: string
  imageUrl?: string
  category?: string
  publishedAt: Date
  readTime?: number
  author?: string
}
```

**Naudojimas**:
```tsx
import { ArticleCard } from "@/components/education/ArticleCard"

<ArticleCard
  article={article}
  onReadMore={(article) => navigateToArticle(article.id)}
/>
```

**Taisyklės**:
- `excerpt` turėtų būti trumpas aprašymas (2-3 sakiniai)
- Data formatuojama su `date-fns` lietuvių kalba
- `readTime` yra minučių skaičius

---

### VideoPlayer (`components/education/VideoPlayer.tsx`)

**Aprašymas**: Video grotuvo komponentas su custom valdikliais.

**Props**:
- `src: string` - Video URL
- `poster?: string` - Posterio vaizdo URL
- `title?: string` - Video pavadinimas
- `className?: string` - Papildomi CSS klasės
- `autoplay?: boolean` - Ar groti automatiškai
- `controls?: boolean` - Rodyti valdiklius

**Naudojimas**:
```tsx
import { VideoPlayer } from "@/components/education/VideoPlayer"

<VideoPlayer
  src="/videos/tutorial.mp4"
  poster="/images/video-poster.jpg"
  title="Tapybos pamoka"
  controls={true}
/>
```

**Taisyklės**:
- Valdikliai rodomi tik hover metu
- Klaviatūros valdymas: Space (play/pause)
- Progress bar yra interaktyvus (galima spustelėti)

---

### WorkshopCard (`components/education/WorkshopCard.tsx`)

**Aprašymas**: Workshop'o kortelė su informacija ir registracijos mygtuku.

**Props**:
- `workshop: Workshop` - Workshop'o duomenys
- `onRegister?: (workshop: Workshop) => void` - Callback registracijai
- `onViewDetails?: (workshop: Workshop) => void` - Callback detalių peržiūrai
- `className?: string` - Papildomi CSS klasės

**Workshop Interface**:
```typescript
interface Workshop {
  id: string
  title: string
  description?: string
  imageUrl?: string
  date: Date
  duration?: number
  location?: string
  maxParticipants?: number
  currentParticipants?: number
  price?: number
  category?: string
  isFull?: boolean
}
```

**Naudojimas**:
```tsx
import { WorkshopCard } from "@/components/education/WorkshopCard"

<WorkshopCard
  workshop={workshop}
  onRegister={(workshop) => registerToWorkshop(workshop.id)}
  onViewDetails={(workshop) => viewWorkshopDetails(workshop.id)}
/>
```

**Taisyklės**:
- Automatiškai nustato ar workshop'as pilnas
- Kaina gali būti 0 (nemokamai)
- Registracijos mygtukas disabled kai workshop'as pilnas

---

## Kontaktų Komponentai

### ContactForm (`components/contact/ContactForm.tsx`)

**Aprašymas**: Kontaktų formos komponentas su validacija.

**Props**:
- `onSubmit?: (data: ContactFormValues) => Promise<void> | void` - Custom submit handler
- `className?: string` - Papildomi CSS klasės

**Formos laukai**:
- `name: string` - Vardas (min 2 simboliai)
- `email: string` - El. paštas (validacija)
- `subject: string` - Tema (min 3 simboliai)
- `message: string` - Žinutė (min 10 simbolių)

**Naudojimas**:
```tsx
import { ContactForm } from "@/components/contact/ContactForm"

<ContactForm
  onSubmit={async (data) => {
    await sendContactMessage(data)
  }}
/>
```

**Taisyklės**:
- Naudoja React Hook Form su Zod validacija
- Automatiškai rodo toast pranešimus
- Jei `onSubmit` neperduotas, siunčia į `/api/contact`
- Forma automatiškai išvaloma po sėkmingo submit

---

## Bendros Taisyklės

### 1. TypeScript
- Visi komponentai turi būti tipizuoti
- Naudokite `interface` arba `type` props apibrėžimui
- Naudokite `React.forwardRef` kai reikia ref

### 2. Styling
- Naudokite Tailwind CSS utility klasės
- Naudokite `cn()` funkciją klasėms sujungti
- Sekite dizaino sistemą (spalvos, tarpai, tipografija)

### 3. Accessibility
- Visi interaktyvūs elementai turi turėti `aria-*` atributus
- Naudokite semantinius HTML elementus
- Klaviatūros navigacija turi būti palaikoma

### 4. Performance
- Naudokite `next/image` paveikslams
- Lazy loading kur įmanoma
- Memoization kai reikia (React.memo, useMemo)

### 5. Internacionalizacija
- Visi tekstai turi būti per `next-intl`
- Naudokite `useTranslations` hook'ą
- Pridėkite vertimus į `messages/lt.json` ir `messages/en.json`

### 6. Error Handling
- Visada turėkite error state paveikslams
- Naudokite try-catch blokus async operacijoms
- Rodykite user-friendly klaidos pranešimus

### 7. Responsive Design
- Mobile-first požiūris
- Naudokite Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Testuokite skirtinguose ekranų dydžiuose

### 8. Code Organization
- Vienas komponentas = vienas failas
- Komponentai turėtų būti maži ir fokusuoti
- Naudokite kompoziciją vietoj didelių komponentų

---

## Pavyzdžiai

### Galerijos puslapis su filtrais ir paieška

```tsx
"use client"

import { useState } from "react"
import { ArtworkCard } from "@/components/gallery/ArtworkCard"
import { GalleryFilter } from "@/components/gallery/GalleryFilter"
import { GallerySearch } from "@/components/gallery/GallerySearch"
import { Lightbox } from "@/components/gallery/Lightbox"

export default function GalleryPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <div className="container px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <GalleryFilter
            categories={categories}
            techniques={techniques}
          />
        </aside>
        <div className="lg:col-span-3">
          <GallerySearch className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onView={(artwork) => {
                  setSelectedArtwork(artwork)
                  setIsLightboxOpen(true)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        artwork={selectedArtwork}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  )
}
```

---

## Atnaujinimai

- **2024-01-XX**: Pradinė versija su visais pagrindiniais komponentais

---

**Pastaba**: Šis dokumentas yra gyvas ir bus atnaujinamas kartu su komponentais.
