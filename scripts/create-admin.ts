/**
 * Script'as admin vartotojo sukūrimui
 * 
 * Naudojimas:
 *   npm run create-admin
 *   arba
 *   tsx scripts/create-admin.ts
 * 
 * Script'as prašys įvesti:
 *   - Email
 *   - Slaptažodį
 *   - Vardą (optional)
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

async function createAdmin() {
  try {
    console.log("=== Admin Vartotojo Sukūrimas ===\n")

    // Email input
    const email = await question("El. paštas: ")
    if (!email || !email.includes("@")) {
      console.error("❌ Netinkamas el. paštas")
      process.exit(1)
    }

    // Patikrinimas ar email jau egzistuoja
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      const update = await question(
        `Vartotojas su el. paštu ${email} jau egzistuoja. Atnaujinti į ADMIN? (y/n): `
      )
      if (update.toLowerCase() !== "y") {
        console.log("Atšaukta")
        process.exit(0)
      }

      // Atnaujinimas į ADMIN
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      })

      console.log(`✅ Vartotojas ${email} atnaujintas į ADMIN`)
      process.exit(0)
    }

    // Password input
    const password = await question("Slaptažodis: ")
    if (!password || password.length < 8) {
      console.error("❌ Slaptažodis turi būti bent 8 simbolių")
      process.exit(1)
    }

    // Name input (optional)
    const name = await question("Vardas (optional, Enter praleisti): ")

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: "ADMIN",
      },
    })

    console.log(`\n✅ Admin vartotojas sėkmingai sukurtas!`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`\nDabar galite prisijungti su šiuo el. paštu ir slaptažodžiu.`)
  } catch (error) {
    console.error("❌ Klaida:", error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

// Run script
createAdmin()
