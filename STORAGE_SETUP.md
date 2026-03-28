# Storage Sistemos Nustatymas

Šis dokumentas paaiškina, kaip susikurti ir sukonfigūruoti failų saugojimo sistemą ArtVilnius projekte.

## 📋 Turinys

1. [Variantai](#variantai)
2. [AWS S3 Nustatymas](#aws-s3-nustatymas)
3. [Lokalus Saugojimas](#lokalus-saugojimas)
4. [Naudojimas Kode](#naudojimas-kode)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Variantai

Projektas palaiko du storage variantus:

### 1. **AWS S3** (Rekomenduojama production)
- ✅ Skalabilus ir patikimas
- ✅ CDN integracija
- ✅ Automatinis backup
- ✅ Saugus prieigos valdymas
- ❌ Reikalinga AWS paskyra
- ❌ Mėnesinės išlaidos (bet labai mažos mažoms aplikacijoms)

### 2. **Lokalus Saugojimas** (Rekomenduojama development)
- ✅ Nemokamas
- ✅ Greitas nustatymas
- ✅ Nereikia išorinių paslaugų
- ❌ Ribotas serverio vietos kiekis
- ❌ Nėra automatinio backup
- ❌ Sunkiau skalinti

---

## ☁️ AWS S3 Nustatymas

### 1 žingsnis: Sukurkite AWS paskyrą

1. Eikite į [AWS Console](https://aws.amazon.com/console/)
2. Prisijunkite arba sukurkite naują paskyrą
3. **Svarbu**: Pirmus 12 mėnesių AWS siūlo nemokamą tier (Free Tier) su:
   - 5GB S3 storage
   - 20,000 GET užklausos
   - 2,000 PUT užklausos

### 2 žingsnis: Sukurkite S3 Bucket

1. AWS Console → **S3** paslauga
2. Spauskite **"Create bucket"**
3. Užpildykite formą:
   - **Bucket name**: `artvilnius-uploads` (arba kitas unikalus pavadinimas)
   - **Region**: Pasirinkite artimiausią (pvz., `eu-west-1` - Airija)
   - **Block Public Access**: 
     - Jei norite viešai prieinamų failų: **Išjunkite** (bet būkite atsargūs!)
     - Jei naudosite signed URLs: **Palikite įjungtą** (saugiau)
   - **Versioning**: Išjunkite (nebent reikia)
   - **Encryption**: Rekomenduojama įjungti
4. Spauskite **"Create bucket"**

### 3 žingsnis: Sukurkite IAM vartotoją (Saugus būdas)

**Kodėl IAM?** Nenaudokite root AWS credentials! Sukurkite atskirą vartotoją su ribotomis teisėmis.

1. AWS Console → **IAM** paslauga
2. Eikite į **Users** → **Create user**
3. Vartotojo vardas: `artvilnius-s3-user`
4. Spauskite **"Next"**
5. **Permissions**: Pasirinkite **"Attach policies directly"**
6. Ieškokite ir pasirinkite: **`AmazonS3FullAccess`** (arba sukurkite custom policy su tik S3 teisėmis)
7. Spauskite **"Next"** → **"Create user"**

### 4 žingsnis: Sukurkite Access Keys

1. Pasirinkite sukurtą vartotoją
2. Eikite į **"Security credentials"** tab
3. Spauskite **"Create access key"**
4. Pasirinkite **"Application running outside AWS"**
5. Spauskite **"Next"** → **"Create access key"**
6. **SVARBU**: Išsaugokite:
   - **Access Key ID** (pvz., `AKIAIOSFODNN7EXAMPLE`)
   - **Secret Access Key** (pvz., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - ⚠️ **Secret key bus rodomas tik vieną kartą!**

### 5 žingsnis: Konfigūruokite .env failą

Atidarykite `.env` failą ir užpildykite:

```env
# Storage konfigūracija
STORAGE_TYPE=s3

# AWS S3 konfigūracija
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=eu-west-1
AWS_S3_BUCKET=artvilnius-uploads
```

### 6 žingsnis: Įdiekite AWS SDK

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 7 žingsnis: Testuokite

Sukurkite test failą arba naudokite esamą API route:

```typescript
// app/api/test-upload/route.ts
import { uploadFile } from '@/lib/storage'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return Response.json({ error: 'Failas nerastas' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  
  const url = await uploadFile({
    buffer,
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
  }, 'test')

  return Response.json({ url })
}
```

---

## 💾 Lokalus Saugojimas

### 1 žingsnis: Konfigūruokite .env failą

```env
# Storage konfigūracija
STORAGE_TYPE=local
```

### 2 žingsnis: Sukurkite uploads aplanką

Aplankas bus sukurtas automatiškai, bet galite sukurti rankiniu būdu:

```bash
mkdir -p public/uploads/artworks
mkdir -p public/uploads/avatars
mkdir -p public/uploads/documents
```

### 3 žingsnis: Patikrinkite .gitignore

Įsitikinkite, kad `.gitignore` faile yra:

```
/public/uploads
```

**Svarbu**: Įkelti failai nebus komituojami į git!

---

## 💻 Naudojimas Kode

### Įkelti failą

```typescript
import { uploadFile } from '@/lib/storage'

// Server Action arba API Route
export async function uploadArtworkImage(formData: FormData) {
  const file = formData.get('image') as File
  
  if (!file) {
    throw new Error('Failas nerastas')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  
  const imageUrl = await uploadFile({
    buffer,
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
  }, 'artworks') // Aplankas: artworks/

  // Išsaugokite imageUrl duomenų bazėje
  // await prisma.artwork.create({ data: { imageUrl, ... } })
  
  return imageUrl
}
```

### Ištrinti failą

```typescript
import { deleteFile } from '@/lib/storage'

export async function deleteArtwork(artworkId: string) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId }
  })

  if (artwork?.imageUrl) {
    await deleteFile(artwork.imageUrl)
  }

  await prisma.artwork.delete({
    where: { id: artworkId }
  })
}
```

### Frontend forma su failo įkėlimu

```typescript
'use client'

import { useState } from 'react'

export function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const { url } = await response.json()
      console.log('Failas įkeltas:', url)
    } catch (error) {
      console.error('Klaida:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Įkeliama...' : 'Įkelti'}
      </button>
    </form>
  )
}
```

---

## 🔧 Troubleshooting

### AWS S3 Klaidos

**Klaida: "Access Denied"**
- Patikrinkite, ar IAM vartotojas turi teises
- Patikrinkite, ar bucket name yra teisingas
- Patikrinkite, ar region yra teisingas

**Klaida: "Bucket does not exist"**
- Patikrinkite bucket pavadinimą `.env` faile
- Patikrinkite, ar bucket yra toje pačioje regione

**Klaida: "Invalid credentials"**
- Patikrinkite ACCESS_KEY_ID ir SECRET_ACCESS_KEY
- Įsitikinkite, kad nėra tarpų ar specialių simbolių

### Lokalus Saugojimas Klaidos

**Klaida: "ENOENT: no such file or directory"**
- Patikrinkite, ar `public/uploads` aplankas egzistuoja
- Patikrinkite, ar aplikacija turi rašymo teises

**Failai neatsiranda naršyklėje**
- Patikrinkite, ar failai yra `public/uploads/` aplanke
- Patikrinkite, ar URL formatas yra `/uploads/folder/file.jpg`
- Next.js development serveryje gali reikėti perkrauti puslapį

---

## 📝 Rekomendacijos

1. **Development**: Naudokite lokalų saugojimą
2. **Production**: Naudokite AWS S3
3. **Failų dydžiai**: Apribokite maksimalų failo dydį (pvz., 10MB)
4. **Failų tipai**: Validuokite failų tipus (tik paveikslai, PDF, ir kt.)
5. **Backup**: Reguliariai darite backup (ypač su lokaliu saugojimu)
6. **CDN**: Production naudokite CloudFront su S3 (greitesnis užkrovimas)

---

## 🔐 Saugumas

1. **Niekada nekomituokite** `.env` failo su credentials
2. **Naudokite IAM vartotojus** su minimaliomis teisėmis
3. **Rotuokite access keys** reguliariai
4. **Validuokite failus** prieš įkeliant (dydis, tipas)
5. **Naudokite signed URLs** jei failai turi būti privataus prieigos

---

## 📚 Papildomi Resursai

- [AWS S3 Dokumentacija](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body)
- [Prisma File Storage Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/file-storage)
