/**
 * Paprastas admin vartotojo sukūrimo script'as su komandinės eilutės argumentais
 * 
 * Naudojimas:
 *   npm run create-admin:simple -- email@example.com password123 "Admin Name"
 *   arba
 *   tsx scripts/create-admin-simple.ts email@example.com password123 "Admin Name"
 */

import { prisma } from "../lib/db"
import bcrypt from "bcryptjs"

async function createAdmin() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error("❌ Naudojimas: npm run create-admin:simple -- <email> <password> [name]")
    console.error("   Pavyzdys: npm run create-admin:simple -- admin@example.com Password123! Admin")
    process.exit(1)
  }

  const [email, password, name] = args

  try {
    console.log("=== Admin Vartotojo Sukūrimas ===\n")

    // Email validacija
    if (!email || !email.includes("@")) {
      console.error("❌ Netinkamas el. paštas")
      process.exit(1)
    }

    // Password validacija
    if (!password || password.length < 8) {
      console.error("❌ Slaptažodis turi būti bent 8 simbolių")
      process.exit(1)
    }

    // Patikrinimas ar email jau egzistuoja
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Atnaujinimas į ADMIN
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      })

      console.log(`✅ Vartotojas ${email} atnaujintas į ADMIN`)
      await prisma.$disconnect()
      process.exit(0)
    }

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
    console.log(`   Name: ${user.name || "Nenurodyta"}`)
    console.log(`   Role: ${user.role}`)
    console.log(`\nDabar galite prisijungti su šiuo el. paštu ir slaptažodžiu.`)
  } catch (error) {
    console.error("❌ Klaida:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run script
createAdmin()
