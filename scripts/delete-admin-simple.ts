/**
 * Paprastas admin vartotojo šalinimo script'as su komandinės eilutės argumentais
 * 
 * Naudojimas:
 *   npm run delete-admin:simple -- email@example.com
 *   arba
 *   tsx scripts/delete-admin-simple.ts email@example.com
 */

import { prisma } from "../lib/db"

async function deleteAdmin() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error("❌ Naudojimas: npm run delete-admin:simple -- <email>")
    console.error("   Pavyzdys: npm run delete-admin:simple -- admin@example.com")
    process.exit(1)
  }

  const email = args[0]

  try {
    console.log("=== Admin Vartotojo Šalinimas ===\n")

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

    // Ištrinti vartotoją
    await prisma.user.delete({
      where: { email },
    })

    console.log(`✅ Admin vartotojas ${email} sėkmingai ištrintas!`)
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
    await prisma.$disconnect()
  }
}

// Run script
deleteAdmin()
