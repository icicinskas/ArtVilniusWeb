# ArtVilnius Web

Vilniaus meno galerijos ir parduotuvės web aplikacija, sukurta su Next.js 14, TypeScript ir Tailwind CSS.

## Technologijos

- **Framework**: Next.js 14+ (App Router)
- **Kalba**: TypeScript
- **Styling**: Tailwind CSS
- **UI Komponentai**: shadcn/ui + Radix UI
- **Duomenų bazė**: PostgreSQL + Prisma ORM
- **Autentifikacija**: NextAuth.js
- **Internacionalizacija**: next-intl
- **Formos**: React Hook Form + Zod
- **State Management**: TanStack Query + Zustand

## Pradžia

### Reikalavimai

- Node.js 18+ 
- PostgreSQL duomenų bazė
- npm arba yarn

### Instaliacija

1. **Klonuokite repozitoriją** (jei naudojate Git):
```bash
git clone <repository-url>
cd ArtVilniusWeb
```

2. **Įdiekite dependencies**:
```bash
npm install
```

3. **Sukurkite `.env` failą**:
```bash
cp .env.example .env
```

4. **Atnaujinkite `.env` failą** su jūsų duomenų bazės URL ir kitais reikalingais kintamaisiais:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/artvilnius?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

5. **Sukurkite Prisma klientą ir migruokite duomenų bazę**:
```bash
npm run db:generate
npm run db:push
# arba naudokite migracijas:
# npm run db:migrate
```

6. **Paleiskite development serverį**:
```bash
npm run dev
```

7. **Atidarykite naršyklę** ir eikite į [http://localhost:3000](http://localhost:3000)

## Projekto Struktūra

```
ArtVilniusWeb/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Daugiakalbystės struktūra (būsima)
│   ├── api/               # API routes
│   ├── globals.css        # Globalūs stiliai
│   ├── layout.tsx         # Pagrindinis layout
│   └── page.tsx           # Pagrindinis puslapis
├── components/            # React komponentai
│   └── ui/                # Baziniai UI komponentai
├── lib/                   # Utilities
│   ├── db.ts              # Prisma klientas
│   └── utils.ts           # Helper funkcijos
├── prisma/                # Prisma schema
│   └── schema.prisma      # Duomenų bazės schema
├── public/                # Statiniai failai
└── messages/              # i18n pranešimai (būsima)
```

## Komandos

- `npm run dev` - Paleisti development serverį
- `npm run build` - Sukurti production build
- `npm run start` - Paleisti production serverį
- `npm run lint` - Paleisti ESLint
- `npm run format` - Formatinti kodą su Prettier
- `npm run db:generate` - Generuoti Prisma klientą
- `npm run db:push` - Push schema į duomenų bazę
- `npm run db:migrate` - Sukurti migraciją
- `npm run db:studio` - Atidaryti Prisma Studio

## Kitas Žingsnis

Projektas yra sukonfigūruotas su visais pagrindiniais setup'ais. Kiti žingsniai:

1. Konfigūruoti NextAuth.js autentifikaciją
2. Sukonfigūruoti next-intl internacionalizaciją
3. Sukurti pagrindinius layout komponentus (Header, Sidebar, Footer)
4. Sukurti autentifikacijos puslapius (login, register)
5. Pradėti kurti galerijos funkcionalumą

## Licencija

Privatus projektas
