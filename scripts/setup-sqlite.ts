/**
 * SQLite Setup Script
 * 
 * Šis skriptas padeda greitai perjungti į SQLite development aplinkai
 * 
 * NAUDOJIMAS:
 * npx tsx scripts/setup-sqlite.ts
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const SCHEMA_PATH = join(process.cwd(), 'prisma', 'schema.prisma')
const ENV_PATH = join(process.cwd(), '.env')

async function setupSQLite() {
  console.log('🔧 Konfigūruojama SQLite...\n')

  try {
    // 1. Atnaujinkite Prisma schema
    console.log('📝 Atnaujinama Prisma schema...')
    const schemaContent = await readFile(SCHEMA_PATH, 'utf-8')
    
    const updatedSchema = schemaContent.replace(
      /datasource db \{[^}]*\}/s,
      `datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
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

    // Pakeiskite arba pridėkite DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        'DATABASE_URL="file:./dev.db"'
      )
    } else {
      envContent += '\n# Database (SQLite)\nDATABASE_URL="file:./dev.db"\n'
    }

    await writeFile(ENV_PATH, envContent, 'utf-8')
    console.log('✅ .env failas atnaujintas\n')

    // 3. Instrukcijos
    console.log('='.repeat(50))
    console.log('✅ SQLite sukonfigūruota!')
    console.log('='.repeat(50))
    console.log('\n📋 Kiti žingsniai:')
    console.log('1. Generuokite Prisma klientą:')
    console.log('   npm run db:generate')
    console.log('\n2. Sukurkite duomenų bazę:')
    console.log('   npm run db:push')
    console.log('\n3. Paleiskite development serverį:')
    console.log('   npm run dev')
    console.log('\n💡 Pastaba: dev.db failas bus sukurtas prisma/ aplanke')
    console.log('💡 Pastaba: dev.db yra .gitignore, todėl nebus komituojamas')
    console.log('\n✅ Viskas paruošta!')
  } catch (error) {
    console.error('❌ Klaida:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

setupSQLite()
