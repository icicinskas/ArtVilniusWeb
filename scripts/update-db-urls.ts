/**
 * Duomenų bazės URL atnaujinimo skriptas
 * 
 * Šis skriptas atnaujina duomenų bazės URL iš lokalaus formato (/uploads/...)
 * į S3 formatą (https://bucket.s3.region.amazonaws.com/...)
 * 
 * NAUDOJIMAS:
 * 1. Įsitikinkite, kad .env faile yra:
 *    STORAGE_TYPE=s3
 *    AWS_S3_BUCKET=...
 *    AWS_REGION=...
 * 
 * 2. Paleiskite:
 *    npx tsx scripts/update-db-urls.ts
 * 
 * SVARBU: Paleiskite migrate-to-s3.ts PIRMIAUSIAI!
 */

import { prisma } from '../lib/db'

/**
 * Konvertuoja lokalų URL į S3 URL
 */
function convertLocalUrlToS3(localUrl: string): string {
  // /uploads/artworks/file.jpg → artworks/file.jpg
  const path = localUrl.replace(/^\/uploads\//, '')
  const bucket = process.env.AWS_S3_BUCKET
  const region = process.env.AWS_REGION || 'eu-west-1'
  
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET nerastas .env faile')
  }
  
  return `https://${bucket}.s3.${region}.amazonaws.com/${path}`
}

/**
 * Atnaujina Artwork modelio URL
 */
async function updateArtworkUrls() {
  console.log('🎨 Atnaujinami Artwork URL...\n')
  
  const artworks = await prisma.artwork.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/',
      },
    },
  })
  
  if (artworks.length === 0) {
    console.log('✅ Nerasta Artwork su lokaliais URL.')
    return { updated: 0, errors: 0 }
  }
  
  console.log(`📋 Rasta ${artworks.length} Artwork su lokaliais URL\n`)
  
  let updated = 0
  let errors = 0
  
  for (const artwork of artworks) {
    try {
      const s3Url = convertLocalUrlToS3(artwork.imageUrl)
      
      await prisma.artwork.update({
        where: { id: artwork.id },
        data: { imageUrl: s3Url },
      })
      
      console.log(`✅ ${artwork.id}: ${artwork.imageUrl} → ${s3Url}`)
      updated++
    } catch (error) {
      console.error(`❌ ${artwork.id}: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`)
      errors++
    }
  }
  
  return { updated, errors }
}

/**
 * Atnaujina User modelio image URL (jei naudojate)
 */
async function updateUserImageUrls() {
  console.log('\n👤 Atnaujinami User image URL...\n')
  
  const users = await prisma.user.findMany({
    where: {
      image: {
        not: null,
        startsWith: '/uploads/',
      },
    },
  })
  
  if (users.length === 0) {
    console.log('✅ Nerasta User su lokaliais image URL.')
    return { updated: 0, errors: 0 }
  }
  
  console.log(`📋 Rasta ${users.length} User su lokaliais image URL\n`)
  
  let updated = 0
  let errors = 0
  
  for (const user of users) {
    if (!user.image) continue
    
    try {
      const s3Url = convertLocalUrlToS3(user.image)
      
      await prisma.user.update({
        where: { id: user.id },
        data: { image: s3Url },
      })
      
      console.log(`✅ ${user.id}: ${user.image} → ${s3Url}`)
      updated++
    } catch (error) {
      console.error(`❌ ${user.id}: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`)
      errors++
    }
  }
  
  return { updated, errors }
}

/**
 * Pagrindinė funkcija
 */
async function updateDatabaseUrls() {
  console.log('🚀 Pradedamas duomenų bazės URL atnaujinimas...\n')
  
  // Patikrinkite, ar STORAGE_TYPE yra s3
  if (process.env.STORAGE_TYPE !== 's3') {
    console.error('❌ KLAIDA: STORAGE_TYPE turi būti "s3" .env faile!')
    process.exit(1)
  }
  
  if (!process.env.AWS_S3_BUCKET) {
    console.error('❌ KLAIDA: AWS_S3_BUCKET nerastas .env faile!')
    process.exit(1)
  }
  
  const results = {
    artwork: { updated: 0, errors: 0 },
    user: { updated: 0, errors: 0 },
  }
  
  // Atnaujinkite Artwork URL
  results.artwork = await updateArtworkUrls()
  
  // Atnaujinkite User image URL
  results.user = await updateUserImageUrls()
  
  // Rodyti rezultatus
  console.log('\n' + '='.repeat(50))
  console.log('📊 ATNAUJINIMO REZULTATAI:')
  console.log('='.repeat(50))
  console.log(`🎨 Artwork: ${results.artwork.updated} atnaujinta, ${results.artwork.errors} klaidų`)
  console.log(`👤 User: ${results.user.updated} atnaujinta, ${results.user.errors} klaidų`)
  console.log(`📊 Iš viso: ${results.artwork.updated + results.user.updated} atnaujinta`)
  console.log(`❌ Klaidos: ${results.artwork.errors + results.user.errors}`)
  console.log('\n✅ Atnaujinimas baigtas!')
}

// Paleiskite atnaujinimą
updateDatabaseUrls()
  .catch((error) => {
    console.error('❌ Kritinė klaida:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
