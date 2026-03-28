# Perėjimas iš Development į Production Storage

## ✅ Atsakymas: **NE, perėjimas yra LABAI PAPRASTAS!**

Sistema sukurta su **abstrakcija**, todėl jums **NEREIKIA keisti jokio kodo**. Tiesiog pakeiskite `.env` failą!

---

## 🎯 Kodėl tai lengva?

### 1. **Abstrakcija**
Visi jūsų funkcijų kvietimai lieka **vienodi**:
```typescript
// Šis kodas veikia TIKSLIAI TAIP PAT su lokaliu ir S3 storage
const url = await uploadFile(file, 'artworks')
await deleteFile(url)
```

### 2. **Automatinis perjungimas**
Sistema automatiškai nustato, kurį storage naudoti pagal `.env` kintamąjį:
- `STORAGE_TYPE=local` → Lokalus saugojimas
- `STORAGE_TYPE=s3` → AWS S3

### 3. **Vienodas API**
Visos funkcijos (`uploadFile`, `deleteFile`, `getFileUrl`) veikia identiškai abiem atvejais.

---

## 📋 Perėjimo Žingsniai

### Žingsnis 1: Sukurkite AWS S3 (jei dar neturite)

Sekite instrukcijas `STORAGE_SETUP.md` faile:
1. Sukurkite AWS paskyrą
2. Sukurkite S3 bucket
3. Sukurkite IAM vartotoją su access keys

### Žingsnis 2: Atnaujinkite `.env` failą

**Development (.env.local):**
```env
STORAGE_TYPE=local
```

**Production (.env.production arba deployment platformos environment variables):**
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=jūsų_access_key
AWS_SECRET_ACCESS_KEY=jūsų_secret_key
AWS_REGION=eu-west-1
AWS_S3_BUCKET=jūsų_bucket_pavadinimas
```

**Tai viskas!** 🎉 Jūsų kodas automatiškai pradės naudoti S3.

---

## ⚠️ SVARBU: Esamų failų perkėlimas

**Problema**: Failai, kurie buvo įkelti lokaliai (`/uploads/...`), **NEBUS automatiškai perkelti** į S3.

### Sprendimas: Migracijos skriptas

Sukurkite migracijos skriptą, kuris perkelia visus esamus failus:

```typescript
// scripts/migrate-to-s3.ts
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { uploadFile } from '@/lib/storage'

/**
 * Perkelia visus lokalius failus į S3
 * 
 * NAUDOJIMAS:
 * 1. Pakeiskite .env: STORAGE_TYPE=s3
 * 2. Paleiskite: npx tsx scripts/migrate-to-s3.ts
 */
async function migrateToS3() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  
  // Surenkame visus failus
  const folders = await readdir(uploadsDir)
  
  for (const folder of folders) {
    const folderPath = join(uploadsDir, folder)
    const files = await readdir(folderPath)
    
    console.log(`Perkeliama ${files.length} failų iš ${folder}/...`)
    
    for (const file of files) {
      try {
        const filePath = join(folderPath, file)
        const buffer = await readFile(filePath)
        
        // Nustatome mimetype pagal plėtinį
        const extension = file.split('.').pop()?.toLowerCase()
        const mimetype = getMimeType(extension)
        
        // Įkelkite į S3
        const url = await uploadFile({
          buffer,
          originalname: file,
          mimetype,
          size: buffer.length,
        }, folder)
        
        console.log(`✅ Perkelta: ${file} → ${url}`)
        
        // OPTIONAL: Ištrinkite lokalų failą po sėkmingo perkėlimo
        // await unlink(filePath)
        
      } catch (error) {
        console.error(`❌ Klaida perkant ${file}:`, error)
      }
    }
  }
  
  console.log('✅ Migracija baigta!')
}

function getMimeType(extension?: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    pdf: 'application/pdf',
  }
  return mimeTypes[extension || ''] || 'application/octet-stream'
}

migrateToS3().catch(console.error)
```

### Duomenų bazės URL atnaujinimas

Jei jūsų duomenų bazėje yra saugomi lokalūs URL (`/uploads/...`), juos reikės atnaujinti į S3 URL:

```typescript
// scripts/update-db-urls.ts
import { prisma } from '@/lib/db'

/**
 * Atnaujina duomenų bazės URL iš lokalaus į S3
 * 
 * SVARBU: Paleiskite migracijos skriptą PIRMIAUSIAI!
 */
async function updateDatabaseUrls() {
  // Pavyzdys su Artwork modeliu
  const artworks = await prisma.artwork.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/', // Randa tik lokalius URL
      },
    },
  })
  
  for (const artwork of artworks) {
    // Konvertuokite lokalų URL į S3 URL
    // Pvz.: /uploads/artworks/file.jpg → https://bucket.s3.region.amazonaws.com/artworks/file.jpg
    const s3Url = convertLocalUrlToS3(artwork.imageUrl)
    
    await prisma.artwork.update({
      where: { id: artwork.id },
      data: { imageUrl: s3Url },
    })
    
    console.log(`✅ Atnaujinta: ${artwork.id}`)
  }
}

function convertLocalUrlToS3(localUrl: string): string {
  // /uploads/artworks/file.jpg → artworks/file.jpg
  const path = localUrl.replace('/uploads/', '')
  const bucket = process.env.AWS_S3_BUCKET
  const region = process.env.AWS_REGION || 'eu-west-1'
  return `https://${bucket}.s3.${region}.amazonaws.com/${path}`
}

updateDatabaseUrls().catch(console.error)
```

---

## 🔄 Perjungimas atgal (S3 → Local)

Jei reikia grįžti atgal į lokalų saugojimą:

1. Pakeiskite `.env`:
   ```env
   STORAGE_TYPE=local
   ```

2. **Svarbu**: S3 failai **NEBUS** automatiškai nukopijuoti lokaliai. Jei reikia, sukurkite atvirkštinį migracijos skriptą.

---

## ✅ Perėjimo Checklist

### Prieš perėjimą:
- [ ] Sukurta AWS paskyra
- [ ] Sukurtas S3 bucket
- [ ] Sukurtas IAM vartotojas su access keys
- [ ] Patikrinta, kad AWS SDK yra įdiegtas (`npm install`)
- [ ] `.env` failas atnaujintas su S3 credentials

### Perėjimo metu:
- [ ] Paleistas migracijos skriptas (jei reikia perkelti esamus failus)
- [ ] Atnaujinti duomenų bazės URL (jei reikia)
- [ ] Ištestuotas failo įkėlimas
- [ ] Ištestuotas failo trynimas

### Po perėjimo:
- [ ] Visi nauji failai eina į S3
- [ ] Esami failai veikia (jei buvo perkelti)
- [ ] Production aplinkoje veikia teisingai
- [ ] Monitoring ir logging veikia

---

## 🎯 Rekomendacijos

### 1. **Hibridinis būdas (Development + Production)**

Galite naudoti skirtingus storage tipus skirtingose aplinkose:

**Development (.env.local):**
```env
STORAGE_TYPE=local
```

**Production (Vercel/Netlify environment variables):**
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
AWS_S3_BUCKET=artvilnius-uploads
```

### 2. **Staging aplinka**

Sukurkite atskirą S3 bucket staging aplinkai:
```env
STORAGE_TYPE=s3
AWS_S3_BUCKET=artvilnius-uploads-staging
```

### 3. **Failų perkėlimas**

Jei turite daug esamų failų:
- Naudokite migracijos skriptą
- Arba palikite juos lokaliai ir tik nauji failai eis į S3
- Arba naudokite AWS CLI: `aws s3 sync public/uploads/ s3://bucket-name/`

---

## 📊 Palyginimas

| Aspektas | Lokalus | S3 |
|----------|---------|-----|
| **Kodo keitimai** | ❌ Nereikia | ❌ Nereikia |
| **.env keitimai** | ✅ Vienas kintamasis | ✅ 4 kintamieji |
| **Esamų failų perkėlimas** | N/A | ⚠️ Reikia skripto |
| **Duomenų bazės atnaujinimas** | N/A | ⚠️ Gali reikėti |
| **Laikas** | ~5 min | ~15-30 min (su migracija) |

---

## 🎉 Išvada

**Perėjimas yra LABAI PAPRASTAS**, nes:
1. ✅ Nereikia keisti kodo
2. ✅ Tiesiog pakeiskite `.env` failą
3. ✅ Sistema automatiškai perjungia storage tipą
4. ⚠️ Vienintelė sudėtingesnė dalis - esamų failų perkėlimas (bet tai neprivaloma!)

**Rekomendacija**: Jei projektas dar development stadijoje ir neturite daug failų, tiesiog pakeiskite `.env` ir viskas! Esami failai gali likti lokaliai, o visi nauji eis į S3.
