# ArtVilnius Web - Projekto Pasiūlymai

## 1. Technologijų Stack Pasiūlymai

### Frontend
- **Framework**: Next.js 14+ (App Router) - React framework su server-side rendering
- **Styling**: Tailwind CSS - utility-first CSS framework
- **UI Komponentai**: 
  - shadcn/ui - modernus, pritaikomas komponentų rinkinys
  - Radix UI - prieinamumo pagrindas
- **Valstybės valdymas**: 
  - Zustand arba React Context - lengvas valstybės valdymas
  - React Query (TanStack Query) - serverio duomenų valdymas
- **Formos**: React Hook Form + Zod - validacija
- **Internacionalizacija**: next-intl - Next.js i18n sprendimas

### Backend
- **API**: Next.js API Routes (Server Actions) - full-stack sprendimas
- **Duomenų bazė**: 
  - PostgreSQL - pagrindinė duomenų bazė
  - Prisma ORM - type-safe duomenų bazės klientas
- **Autentifikacija**: NextAuth.js (Auth.js) - saugus autentifikacijos sprendimas
- **Failų saugojimas**: 
  - AWS S3 / Cloudflare R2 - paveikslų saugojimas
  - arba lokalus saugojimas su Next.js Image Optimization

### Deployment
- **Hosting**: Vercel (optimalus Next.js) arba Netlify
- **Duomenų bazė**: Supabase, Railway, arba Vercel Postgres
- **CDN**: Vercel Edge Network (automatiniškai su Vercel)

## 2. Architektūros Pasiūlymai

### Projekto Struktūra
```
ArtVilniusWeb/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Daugiakalbystės struktūra
│   │   ├── (auth)/              # Autentifikacijos grupė
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/              # Pagrindinė grupė
│   │   │   ├── gallery/         # Galerija
│   │   │   ├── shop/            # Parduotuvė
│   │   │   ├── education/       # Švietėjiška veikla
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── (admin)/             # Admin grupė
│   │   │   ├── admin/
│   │   │   └── moderator/
│   │   ├── layout.tsx           # Pagrindinis layout
│   │   └── page.tsx             # Pagrindinis puslapis
│   ├── api/                     # API routes
│   └── globals.css
├── components/                   # React komponentai
│   ├── ui/                      # Baziniai UI komponentai
│   ├── layout/                  # Layout komponentai
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── gallery/                 # Galerijos komponentai
│   ├── shop/                    # Parduotuvės komponentai
│   └── admin/                   # Admin komponentai
├── lib/                         # Utilities
│   ├── auth.ts                  # Autentifikacijos konfigūracija
│   ├── db.ts                    # Prisma klientas
│   ├── i18n.ts                  # Internacionalizacijos setup
│   └── utils.ts
├── prisma/                      # Prisma schema
│   └── schema.prisma
├── public/                      # Statiniai failai
│   └── images/
├── messages/                     # i18n pranešimai
│   ├── lt.json
│   └── en.json
├── types/                       # TypeScript tipai
└── middleware.ts                # Next.js middleware (auth, i18n)
```

## 3. Vartotojų Rolės ir Teisės

### Svečias (Guest)
- ✅ Peržiūrėti visą viešą informaciją
- ✅ Peržiūrėti galeriją (su vandens ženklais)
- ✅ Peržiūrėti parduotuvę (be kainų detalių)
- ✅ Peržiūrėti švietėjišką turinį
- ❌ Pirkimas
- ❌ Komentarai
- ❌ Asmeninė informacija

### Vartotojas (User)
- ✅ Visos svečio teisės
- ✅ Pilna parduotuvės informacija (su kainomis)
- ✅ Pirkimas
- ✅ Komentarai ir vertinimai
- ✅ Asmeninis profilis
- ✅ Mėgstamiausi darbai
- ✅ Pirkimų istorija
- ❌ Turinio redagavimas
- ❌ Moderavimas

### Moderatorius (Moderator)
- ✅ Visos vartotojo teisės
- ✅ Komentarų moderavimas
- ✅ Turinio patvirtinimas
- ✅ Vartotojų valdymas (apribotas)
- ✅ Statistikos peržiūra
- ❌ Sistemos nustatymai
- ❌ Vartotojų rolės keitimas

### Administratorius (Admin)
- ✅ Visos teisės
- ✅ Pilnas turinio valdymas
- ✅ Vartotojų valdymas
- ✅ Rolės valdymas
- ✅ Sistemos nustatymai
- ✅ Analytics ir statistikos
- ✅ Internacionalizacijos valdymas

## 4. Funkcionalumo Aprašymas

### Galerija
- **Filtravimas**: kategorijos, technika, dydis, kaina, data
- **Paieška**: pagal pavadinimą, autorių, aprašymą
- **Rūšiavimas**: data, populiarumas, kaina
- **Peržiūra**: lightbox modal, zoom funkcija
- **Vandens ženklai**: svečiams
- **Mėgstamiausi**: registruotiems vartotojams

### Parduotuvė
- **Produktų katalogas**: paveikslai su detalėmis
- **Krepšelis**: pirkinių krepšelis
- **Apmokėjimas**: Stripe arba PayPal integracija
- **Užsakymų valdymas**: vartotojo puslapyje
- **Pristatymas**: virtualus arba fizinis

### Švietėjiška Veikla
- **Straipsniai**: apie tapybą, technikas, istoriją
- **Video**: mokomieji video
- **Workshop'ai**: renginių kalendorius
- **Kategorijos**: skirtingos temos

### Admin Panel
- **Dashboard**: statistikos, greitieji veiksmai
- **Turinio valdymas**: CRUD operacijos
- **Vartotojų valdymas**: sąrašas, redagavimas, rolės
- **Užsakymų valdymas**: visi užsakymai, statusų keitimas
- **Nustatymai**: puslapio konfigūracija

## 5. Dizaino Pasiūlymai

### Dizaino Principai
- **Minimalizmas**: švarus, modernus dizainas
- **Fokusas**: paveikslai kaip pagrindinis elementas
- **Spalvos**: neutralios spalvos (baltas, pilkas, juodas) su akcentinėmis
- **Tipografija**: aiški, skaitoma šrifto šeima (Inter, Poppins)
- **Tarpai**: erdvus, kvėpuojantis dizainas

### Responsive Dizainas
- **Mobile First**: pradedant nuo mobiliojo
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Mobilusis meniu**: hamburger meniu su slide-out
- **Sidebar**: tik desktop, mobile - drawer

### Komponentai
- **Header**: fiksuotas, su navigacija, kalbos pasirinkimu, paieška
- **Sidebar**: fiksuotas desktop, su kategorijomis, filtrais
- **Card**: paveikslų kortelės su hover efektais
- **Modal**: lightbox, formos, patvirtinimai
- **Formos**: modernios, su validacija

## 6. Internacionalizacija (i18n)

### Implementacija
- **Biblioteka**: next-intl
- **Struktūra**: `[locale]` dinaminis segmentas
- **Pranešimai**: JSON failai kiekvienai kalbai
- **Kalbos pasirinkimas**: header dropdown
- **Numatotoji kalba**: Lietuvių (lt)
- **Papildomos kalbos**: lengvai pridedamos per JSON failus

### Kalbų Valdymas
- Kalbos pasirinkimas išsaugomas cookie
- URL struktūra: `/lt/gallery`, `/en/gallery`
- Automatinis kalbos aptikimas pagal naršyklę (optional)

## 7. Saugumas

### Autentifikacija
- **NextAuth.js**: saugus session valdymas
- **Password hashing**: bcrypt
- **JWT tokens**: saugus token valdymas
- **OAuth**: Google, Facebook (optional)

### Autorizacija
- **Role-based access control (RBAC)**: middleware lygmenyje
- **API apsauga**: kiekviename route
- **CSRF apsauga**: Next.js integruota
- **XSS apsauga**: React automatiškai

### Duomenų Apsauga
- **Input validacija**: Zod schemos
- **SQL injection**: Prisma ORM apsauga
- **Failų validacija**: tipo ir dydžio patikra

## 8. Performance Optimizavimas

### Next.js Optimizacijos
- **Image Optimization**: Next.js Image komponentas
- **Code Splitting**: automatinis
- **Server Components**: kur įmanoma
- **Static Generation**: kur įmanoma (ISR)

### Duomenų Optimizavimas
- **Caching**: React Query cache
- **Pagination**: dideliems sąrašams
- **Lazy Loading**: paveikslų lazy loading
- **CDN**: statinių failų CDN

## 9. Implementacijos Planas

### Faza 1: Pagrindas (1-2 savaitės)
- [ ] Next.js projekto setup
- [ ] Tailwind CSS konfigūracija
- [ ] Prisma schema ir duomenų bazė
- [ ] NextAuth.js konfigūracija
- [ ] Pagrindinis layout (Header, Sidebar, Footer)
- [ ] Internacionalizacijos setup

### Faza 2: Autentifikacija ir Vartotojai (1 savaitė)
- [ ] Prisijungimo/registracijos puslapiai
- [ ] Vartotojų rolės sistema
- [ ] Profilio puslapis
- [ ] Middleware autorizacija

### Faza 3: Galerija (1-2 savaitės)
- [ ] Galerijos puslapis
- [ ] Filtravimas ir paieška
- [ ] Lightbox peržiūra
- [ ] Vandens ženklai
- [ ] Mėgstamiausi

### Faza 4: Parduotuvė (2 savaitės)
- [ ] Produktų katalogas
- [ ] Krepšelis
- [ ] Apmokėjimo integracija
- [ ] Užsakymų valdymas

### Faza 5: Švietėjiška Veikla (1 savaitė)
- [ ] Straipsnių sistema
- [ ] Video integracija
- [ ] Workshop kalendorius

### Faza 6: Admin Panel (2 savaitės)
- [ ] Admin dashboard
- [ ] CRUD operacijos
- [ ] Vartotojų valdymas
- [ ] Statistikos

### Faza 7: Optimizavimas ir Testavimas (1 savaitė)
- [ ] Performance optimizavimas
- [ ] Responsive testavimas
- [ ] Saugumo auditas
- [ ] Bug fix'ai

## 10. Rekomenduojamos Bibliotekos

### Core
- `next` - Next.js framework
- `react` & `react-dom` - React
- `typescript` - TypeScript

### Styling
- `tailwindcss` - Tailwind CSS
- `@radix-ui/*` - UI primityvai
- `lucide-react` - Ikonos

### Forms & Validation
- `react-hook-form` - Formos
- `zod` - Validacija
- `@hookform/resolvers` - Zod resolver

### State & Data
- `@tanstack/react-query` - Server state
- `zustand` - Client state (optional)

### Auth
- `next-auth` - Autentifikacija
- `bcryptjs` - Password hashing

### Database
- `@prisma/client` - Prisma klientas
- `prisma` - Prisma CLI

### i18n
- `next-intl` - Internacionalizacija

### Payments (optional)
- `stripe` - Stripe integracija
- `@stripe/stripe-js` - Stripe JS

### Utilities
- `date-fns` - Datos formatavimas
- `clsx` - ClassName utilitės
- `zod` - Schema validacija

## 11. Pavyzdinė Prisma Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(USER)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders        Order[]
  favorites     Favorite[]
  comments      Comment[]
}

enum Role {
  GUEST
  USER
  MODERATOR
  ADMIN
}

model Artwork {
  id            String    @id @default(cuid())
  title         String
  description   String?
  imageUrl      String
  price         Float?
  category      String
  technique     String?
  dimensions    String?
  year          Int?
  isForSale     Boolean   @default(false)
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  favorites     Favorite[]
  orderItems    OrderItem[]
  comments      Comment[]
}

model Order {
  id            String    @id @default(cuid())
  userId        String
  status        OrderStatus @default(PENDING)
  total         Float
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user          User      @relation(fields: [userId], references: [id])
  items         OrderItem[]
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## 12. Kitos Rekomendacijos

### SEO
- Next.js automatinis SEO
- Meta tag'ai kiekvienam puslapiui
- Sitemap generavimas
- Structured data (JSON-LD)

### Analytics
- Google Analytics arba Vercel Analytics
- User behavior tracking
- Conversion tracking

### Backup
- Automatinis duomenų bazės backup
- Failų saugojimas su versijavimu

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

---

**Pastaba**: Šis dokumentas yra pradinis pasiūlymas. Detalės gali būti koreguojamos pagal specifinius poreikius ir prioritetus.
