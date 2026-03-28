# Autentifikacijos Sistemos Problemų Sprendimas

## HTTP 500 Klaida `/api/auth/error`

Jei matote HTTP 500 klaidą autentifikacijos route'e, patikrinkite šiuos dalykus:

### 1. NEXTAUTH_SECRET Environment Kintamasis

**Problema**: `NEXTAUTH_SECRET` nėra nustatytas arba yra neteisingas.

**Sprendimas**:
1. Patikrinkite ar `.env` failas egzistuoja projekto šakninėje direktorijoje
2. Įsitikinkite, kad `.env` faile yra:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```
3. `NEXTAUTH_SECRET` turi būti:
   - Bent 32 simbolių ilgio
   - Unikalus ir saugus (naudokite `openssl rand -base64 32` arba online generator)
   - Niekada necommit'intas į Git

**Kaip sukurti secret**:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 2. Duomenų Bazės Prisijungimas

**Problema**: Duomenų bazė nepasiekiama arba schema nėra sukurta.

**Sprendimas**:
1. Patikrinkite `DATABASE_URL` `.env` faile
2. Įsitikinkite, kad duomenų bazė veikia
3. Paleiskite migracijas:
   ```bash
   npm run db:generate
   npm run db:push
   ```

### 3. NextAuth Konfigūracija

**Problema**: NextAuth konfigūracija neteisinga.

**Sprendimas**:
1. Patikrinkite `lib/auth.ts` failą
2. Įsitikinkite, kad `authOptions` yra teisingai eksportuojamas
3. Patikrinkite serverio log'us dėl detalių klaidos pranešimų

### 4. Development Serverio Paleidimas

**Problema**: Serveris nebuvo teisingai paleistas.

**Sprendimas**:
1. Sustabdykite serverį (Ctrl+C)
2. Išvalykite `.next` cache:
   ```bash
   rm -rf .next
   # arba Windows PowerShell:
   Remove-Item -Recurse -Force .next
   ```
3. Paleiskite serverį iš naujo:
   ```bash
   npm run dev
   ```

## Dažniausios Klaidos

### "NEXTAUTH_SECRET is not defined"
- **Sprendimas**: Pridėkite `NEXTAUTH_SECRET` į `.env` failą

### "Prisma Client not generated"
- **Sprendimas**: Paleiskite `npm run db:generate`

### "Database connection failed"
- **Sprendimas**: Patikrinkite `DATABASE_URL` ir duomenų bazės būseną

### "Cannot find module '@/lib/auth'"
- **Sprendimas**: Patikrinkite `tsconfig.json` path mappings

## Debugging Patarimai

1. **Patikrinkite serverio log'us**: Terminale turėtumėte matyti detalią klaidos informaciją
2. **Naudokite browser console**: F12 → Console tab
3. **Patikrinkite Network tab**: F12 → Network tab, ieškokite failed requests
4. **Patikrinkite `.env` failą**: Įsitikinkite, kad visi reikalingi kintamieji yra nustatyti

## Reikalingi Environment Kintamieji

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL="file:./dev.db"  # SQLite
# arba
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"  # PostgreSQL
```

## Susisiekite

Jei problemos išlieka, patikrinkite:
- Serverio log'us
- Browser console
- Network requests
- `.env` failo turinį (be jautrių duomenų)
