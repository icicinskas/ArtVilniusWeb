/**
 * Migracijos skriptas: Lokalus → S3
 * 
 * Šis skriptas perkelia visus lokalius failus iš public/uploads/ į AWS S3
 * 
 * NAUDOJIMAS:
 * 1. Įsitikinkite, kad .env faile yra:
 *    STORAGE_TYPE=s3
 *    AWS_ACCESS_KEY_ID=...
 *    AWS_SECRET_ACCESS_KEY=...
 *    AWS_REGION=...
 *    AWS_S3_BUCKET=...
 * 
 * 2. Paleiskite:
 *    npx tsx scripts/migrate-to-s3.ts
 * 
 * ARBA su ts-node:
 *    npx ts-node scripts/migrate-to-s3.ts
 */

import { readdir, readFile, unlink, stat } from 'fs/promises'
import { join } from 'path'
import { uploadFile } from '../lib/storage'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

/**
 * Nustato MIME tipą pagal failo plėtinį
 */
function getMimeType(extension?: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    json: 'application/json',
    xml: 'application/xml',
    svg: 'image/svg+xml',
  }
  return mimeTypes[extension?.toLowerCase() || ''] || 'application/octet-stream'
}

/**
 * Rekursyviai suranda visus failus aplanke
 */
async function getAllFiles(dir: string, basePath: string = ''): Promise<Array<{ path: string; folder: string; fileName: string }>> {
  const files: Array<{ path: string; folder: string; fileName: string }> = []
  
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name
      
      if (entry.isDirectory()) {
        // Rekursyviai eikite į subaplankus
        const subFiles = await getAllFiles(fullPath, relativePath)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        // Ištraukiame folder ir fileName
        const parts = relativePath.split('/')
        const fileName = parts.pop() || entry.name
        const folder = parts.join('/') || 'general'
        
        files.push({
          path: fullPath,
          folder,
          fileName,
        })
      }
    }
  } catch (error) {
    console.error(`Klaida skaitant aplanką ${dir}:`, error)
  }
  
  return files
}

/**
 * Pagrindinė migracijos funkcija
 */
async function migrateToS3() {
  console.log('🚀 Pradedama migracija į S3...\n')
  
  // Patikrinkite, ar STORAGE_TYPE yra s3
  if (process.env.STORAGE_TYPE !== 's3') {
    console.error('❌ KLAIDA: STORAGE_TYPE turi būti "s3" .env faile!')
    console.log('Patikrinkite .env failą ir bandykite dar kartą.')
    process.exit(1)
  }
  
  // Patikrinkite, ar uploads aplankas egzistuoja
  try {
    await stat(UPLOADS_DIR)
  } catch (error) {
    console.error(`❌ KLAIDA: Aplankas ${UPLOADS_DIR} neegzistuoja!`)
    process.exit(1)
  }
  
  // Suraskite visus failus
  console.log('📂 Ieškoma failų...')
  const files = await getAllFiles(UPLOADS_DIR)
  
  if (files.length === 0) {
    console.log('✅ Nerasta failų perkėlimui.')
    return
  }
  
  console.log(`📋 Rasta ${files.length} failų\n`)
  
  let successCount = 0
  let errorCount = 0
  const errors: Array<{ file: string; error: string }> = []
  
  // Perkelkite kiekvieną failą
  for (let i = 0; i < files.length; i++) {
    const { path, folder, fileName } = files[i]
    const progress = `[${i + 1}/${files.length}]`
    
    try {
      // Perskaitykite failą
      const buffer = await readFile(path)
      
      // Nustatykite MIME tipą
      const extension = fileName.split('.').pop()
      const mimetype = getMimeType(extension)
      
      // Įkelkite į S3
      const url = await uploadFile(
        {
          buffer,
          originalname: fileName,
          mimetype,
          size: buffer.length,
        },
        folder
      )
      
      console.log(`${progress} ✅ ${folder}/${fileName} → ${url}`)
      successCount++
      
      // OPTIONAL: Ištrinkite lokalų failą po sėkmingo perkėlimo
      // Atkomentuokite, jei norite automatiškai ištrinti lokalius failus:
      // await unlink(path)
      // console.log(`   🗑️  Ištrintas lokalus failas`)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nežinoma klaida'
      console.error(`${progress} ❌ ${folder}/${fileName}: ${errorMessage}`)
      errorCount++
      errors.push({ file: `${folder}/${fileName}`, error: errorMessage })
    }
  }
  
  // Rodyti rezultatus
  console.log('\n' + '='.repeat(50))
  console.log('📊 MIGRACIJOS REZULTATAI:')
  console.log('='.repeat(50))
  console.log(`✅ Sėkmingai perkelta: ${successCount}`)
  console.log(`❌ Klaidos: ${errorCount}`)
  console.log(`📁 Iš viso failų: ${files.length}`)
  
  if (errors.length > 0) {
    console.log('\n⚠️  KLAIDOS:')
    errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`)
    })
  }
  
  if (successCount > 0) {
    console.log('\n💡 PRIMINIMAS:')
    console.log('Jei norite ištrinti lokalius failus po migracijos,')
    console.log('atkomentuokite unlink() eilutes šiame skripte ir paleiskite dar kartą.')
    console.log('\n💡 SVARBU:')
    console.log('Atnaujinkite duomenų bazės URL, jei ten saugomi lokalūs URL!')
    console.log('Naudokite scripts/update-db-urls.ts skriptą.')
  }
  
  console.log('\n✅ Migracija baigta!')
}

// Paleiskite migraciją
migrateToS3().catch((error) => {
  console.error('❌ Kritinė klaida:', error)
  process.exit(1)
})
