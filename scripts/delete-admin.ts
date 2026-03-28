/**
 * Script'as admin vartotojo šalinimui iš duomenų bazės
 * 
 * Naudojimas:
 *   npm run delete-admin
 *   arba
 *   npx tsx scripts/delete-admin.ts
 */

import { prisma } from "../lib/db"
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

async function deleteAdmin() {
  try {
    console.log("=== Admin Vartotojo Šalinimas ===\n")

    // Rasti visus admin vartotojus
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    if (adminUsers.length === 0) {
      console.log("ℹ️  Duomenų bazėje nėra admin vartotojų")
      process.exit(0)
    }

    console.log("Rasti admin vartotojai:")
    adminUsers.forEach((user, index) => {
      console.log(
        `  ${index + 1}. ${user.email} (${user.name || "Nenurodyta"}) - ID: ${user.id}`
      )
    })

    const email = await question("\nĮveskite el. paštą vartotojo, kurį norite ištrinti: ")

    if (!email) {
      console.log("Atšaukta")
      process.exit(0)
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Vartotojas su el. paštu ${email} nerastas`)
      process.exit(1)
    }

    if (user.role !== "ADMIN") {
      console.error(`❌ Vartotojas ${email} nėra ADMIN (dabartinė rolė: ${user.role})`)
      process.exit(1)
    }

    const confirm = await question(
      `\n⚠️  Ar tikrai norite ištrinti admin vartotoją ${email}? (y/n): `
    )

    if (confirm.toLowerCase() !== "y") {
      console.log("Atšaukta")
      process.exit(0)
    }

    // Ištrinti vartotoją
    await prisma.user.delete({
      where: { email },
    })

    console.log(`\n✅ Admin vartotojas ${email} sėkmingai ištrintas!`)
    console.log("\nDabar galite sukurti naują admin vartotoją:")
    console.log("  npm run create-admin")
    console.log("  arba")
    console.log("  npm run create-admin:simple -- email@example.com Password123!")
  } catch (error) {
    console.error("❌ Klaida:", error)
    if (error instanceof Error) {
      console.error("   Message:", error.message)
    }
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

// Run script
deleteAdmin()
