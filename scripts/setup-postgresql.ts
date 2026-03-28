/**
 * PostgreSQL Setup Script
 * 
 * Šis skriptas padeda greitai perjungti į PostgreSQL
 * 
 * NAUDOJIMAS:
 * npx tsx scripts/setup-postgresql.ts
 * 
 * ARBA su connection string:
 * npx tsx scripts/setup-postgresql.ts "postgresql://user:pass@localhost:5432/db"
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const SCHEMA_PATH = join(process.cwd(), 'prisma', 'schema.prisma')
const ENV_PATH = join(process.cwd(), '.env')

async function setupPostgreSQL(connectionString?: string) {
  console.log('🔧 Konfigūruojama PostgreSQL...\n')

  try {
    // 1. Atnaujinkite Prisma schema
    console.log('📝 Atnaujinama Prisma schema...')
    const schemaContent = await readFile(SCHEMA_PATH, 'utf-8')
    
    const updatedSchema = schemaContent.replace(
      /datasource db \{[^}]*\}/s,
      `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`
    )

    await writeFile(SCHEMA_PATH, updatedSchema, 'utf-8')
    console.log('✅ Prisma schema atnaujinta\n')

    // 2. Atnaujinkite .env failą
    console.log('📝 Atnaujinamas .env failas...')
    let envContent = ''
    
    try {
      envContent = await readFile(ENV_PATH, 'utf-8')
    } catch (error) {
      // .env failas neegzistuoja, sukursime naują
      console.log('⚠️  .env failas neegzistuoja, kuriamas naujas...')
    }

    // Nustatykite DATABASE_URL
    const dbUrl = connectionString || 'postgresql://user:password@localhost:5432/artvilnius?schema=public'

    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL="${dbUrl}"`
      )
    } else {
      envContent += `\n# Database (PostgreSQL)\nDATABASE_URL="${dbUrl}"\n`
    }

    await writeFile(ENV_PATH, envContent, 'utf-8')
    console.log('✅ .env failas atnaujintas\n')

    // 3. Instrukcijos
    console.log('='.repeat(50))
    console.log('✅ PostgreSQL sukonfigūruota!')
    console.log('='.repeat(50))
    console.log('\n📋 Kiti žingsniai:')
    console.log('1. Įsitikinkite, kad PostgreSQL veikia')
    console.log('2. Sukurkite duomenų bazę (jei reikia):')
    console.log('   CREATE DATABASE artvilnius;')
    console.log('\n3. Atnaujinkite .env failą su teisingu DATABASE_URL')
    console.log('\n4. Generuokite Prisma klientą:')
    console.log('   npm run db:generate')
    console.log('\n5. Sukurkite duomenų bazę:')
    console.log('   npm run db:push')
    console.log('\n6. Paleiskite development serverį:')
    console.log('   npm run dev')
    console.log('\n💡 Pastaba: Patikrinkite, ar PostgreSQL servisas veikia')
    console.log('💡 Pastaba: Patikrinkite firewall nustatymus')
    console.log('\n✅ Viskas paruošta!')
  } catch (error) {
    console.error('❌ Klaida:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Gaukite connection string iš argumentų
const connectionString = process.argv[2]
setupPostgreSQL(connectionString)
