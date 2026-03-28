/**
 * Script'as admin vartotojo slaptažodžio patikrinimui
 */

import { prisma } from "../lib/db"
import bcrypt from "bcryptjs"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function testLogin() {
  try {
    console.log("=== Admin Vartotojo Prisijungimo Testas ===\n")

    const email = await question("El. paštas: ")
    const password = await question("Slaptažodis: ")

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error("❌ Vartotojas nerastas")
      process.exit(1)
    }

    console.log(`\n✅ Vartotojas rastas:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
      console.log("\n✅ Slaptažodis TEISINGAS!")
    } else {
      console.log("\n❌ Slaptažodis NETESINGAS!")
    }
  } catch (error) {
    console.error("❌ Klaida:", error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

testLogin()
