# Duomenų Bazės Nustatymas

Šis dokumentas paaiškina, kaip susikurti ir sukonfigūruoti duomenų bazę ArtVilnius projekte.

## 📋 Variantai

### 1. **PostgreSQL** (Rekomenduojama production)
- ✅ Galinga ir skalabilus
- ✅ Puikiai veikia su Prisma
- ✅ Tinka didelėms aplikacijoms
- ❌ Reikia atskiro serverio arba paslaugos
- ❌ Reikia konfigūracijos

### 2. **SQLite** (Rekomenduojama development)
- ✅ Nereikia atskiro serverio
- ✅ Greitas nustatymas
- ✅ Veikia iš karto
- ✅ Puikiai tinka development
- ❌ Ribotas production naudojimui (bet veikia mažoms aplikacijoms)

---

## 🚀 Greitas Startas su SQLite (Development)

Jei neturite PostgreSQL arba norite greitai pradėti, naudokite SQLite:

### 1 žingsnis: Pakeiskite Prisma schema

Atidarykite `prisma/schema.prisma` ir pakeiskite:

```prisma
datasource db {
  provider = "sqlite"  // Pakeiskite iš "postgresql"
  url      = "file:./dev.db"  // Pakeiskite iš env("DATABASE_URL")
}
```

### 2 žingsnis: Atnaujinkite .env failą

Pridėkite arba pakeiskite `.env` faile:

```env
# SQLite (development)
DATABASE_URL="file:./dev.db"
```

### 3 žingsnis: Generuokite Prisma klientą ir sukurkite duomenų bazę

```bash
npm run db:generate
npm run db:push
```

**Done!** Dabar turite veikiančią duomenų bazę.

---

## 🐘 PostgreSQL Nustatymas

### Variantas A: Lokalus PostgreSQL

#### Windows (su Chocolatey):

```powershell
# Įdiekite PostgreSQL
choco install postgresql

# Arba atsisiųskite iš https://www.postgresql.org/download/windows/
```

#### Windows (Rankinis):

1. Atsisiųskite PostgreSQL iš [postgresql.org](https://www.postgresql.org/download/windows/)
2. Įdiekite su visais default nustatymais
3. Prisiminkite slaptažodį, kurį nustatėte

#### Sukurkite duomenų bazę:

```powershell
# Prisijunkite prie PostgreSQL
psql -U postgres

# Sukurkite duomenų bazę
CREATE DATABASE artvilnius;

# Sukurkite vartotoją (optional)
CREATE USER artvilnius_user WITH PASSWORD 'jūsų_slaptažodis';
GRANT ALL PRIVILEGES ON DATABASE artvilnius TO artvilnius_user;

# Išeikite
\q
```

#### Atnaujinkite .env failą:

```env
DATABASE_URL="postgresql://postgres:jūsų_slaptažodis@localhost:5432/artvilnius?schema=public"
```

Arba su vartotoju:

```env
DATABASE_URL="postgresql://artvilnius_user:jūsų_slaptažodis@localhost:5432/artvilnius?schema=public"
```

### Variantas B: Cloud PostgreSQL (Rekomenduojama)

#### Supabase (Nemokama):

1. Eikite į [supabase.com](https://supabase.com)
2. Sukurkite naują projektą
3. Eikite į **Settings** → **Database**
4. Nukopijuokite **Connection string** (URI format)
5. Įdėkite į `.env` failą:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

#### Railway (Nemokama):

1. Eikite į [railway.app](https://railway.app)
2. Sukurkite naują projektą
3. Pridėkite PostgreSQL duomenų bazę
4. Nukopijuokite **DATABASE_URL** iš **Variables** sekcijos
5. Įdėkite į `.env` failą

#### Vercel Postgres:

1. Vercel projekte eikite į **Storage** → **Create Database** → **Postgres**
2. Nukopijuokite **DATABASE_URL**
3. Įdėkite į `.env` failą

### Variantas C: Docker PostgreSQL

Jei turite Docker:

```bash
# Paleiskite PostgreSQL konteinerį
docker run --name artvilnius-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=artvilnius \
  -p 5432:5432 \
  -d postgres:15

# .env failas:
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/artvilnius?schema=public"
```

---

## 🔧 Troubleshooting

### Klaida: "Can't reach database server at `localhost:5432`"

**Sprendimai:**

1. **Patikrinkite, ar PostgreSQL veikia:**
   ```powershell
   # Windows
   Get-Service -Name postgresql*
   
   # Arba patikrinkite Task Manager → Services
   ```

2. **Paleiskite PostgreSQL servisą:**
   ```powershell
   # Windows
   Start-Service postgresql-x64-15  # Pakeiskite versiją
   ```

3. **Patikrinkite portą:**
   ```powershell
   netstat -an | findstr :5432
   ```

4. **Patikrinkite firewall:**
   - Įsitikinkite, kad Windows Firewall neblokuoja 5432 porto

5. **Patikrinkite .env failą:**
   - Įsitikinkite, kad `DATABASE_URL` yra teisingas
   - Nėra tarpų ar specialių simbolių
   - Slaptažodis yra teisingas

### Klaida: "password authentication failed"

- Patikrinkite slaptažodį `.env` faile
- Jei naudojate cloud PostgreSQL, naudokite teisingą connection string

### Klaida: "database does not exist"

- Sukurkite duomenų bazę:
  ```sql
  CREATE DATABASE artvilnius;
  ```

---

## 🔄 Perjungimas tarp SQLite ir PostgreSQL

### Iš SQLite į PostgreSQL:

1. Eksportuokite duomenis iš SQLite (jei reikia)
2. Pakeiskite `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Atnaujinkite `.env` su PostgreSQL URL
4. Paleiskite:
   ```bash
   npm run db:generate
   npm run db:push
   ```

### Iš PostgreSQL į SQLite:

1. Pakeiskite `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```
2. Atnaujinkite `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
3. Paleiskite:
   ```bash
   npm run db:generate
   npm run db:push
   ```

---

## 📝 Rekomendacijos

1. **Development**: Naudokite SQLite - greitas ir paprastas
2. **Production**: Naudokite PostgreSQL - galingas ir skalabilus
3. **Cloud**: Naudokite Supabase arba Railway - nemokama ir lengva
4. **Backup**: Reguliariai darite duomenų bazės backup
5. **Migrations**: Naudokite `npm run db:migrate` production aplinkoje

---

## 🎯 Greitas Startas (SQLite)

Jei norite greitai pradėti:

1. Pakeiskite `prisma/schema.prisma` (žr. aukščiau)
2. Atnaujinkite `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
3. Paleiskite:
   ```bash
   npm run db:generate
   npm run db:push
   ```

**Done!** Dabar galite pradėti kurti aplikaciją.

---

## 📚 Papildomi Resursai

- [Prisma Dokumentacija](https://www.prisma.io/docs)
- [PostgreSQL Dokumentacija](https://www.postgresql.org/docs/)
- [Supabase Dokumentacija](https://supabase.com/docs)
- [Railway Dokumentacija](https://docs.railway.app)
