/**
 * Script'as duomenų bazės būsenai patikrinti
 */

import { prisma } from "../lib/db"

async function checkDatabase() {
  try {
    console.log("🔍 Tikrinama duomenų bazės būsena...\n")

    // Patikrinimas ar duomenų bazė veikia
    await prisma.$connect()
    console.log("✅ Duomenų bazės prisijungimas sėkmingas\n")

    // Vartotojų skaičius
    const userCount = await prisma.user.count()
    console.log(`📊 Vartotojų skaičius: ${userCount}`)

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        take: 10,
      })

      console.log("\n👥 Vartotojai:")
      users.forEach((user, index) => {
        console.log(
          `  ${index + 1}. ${user.email} (${user.role}) - ${user.name || "Nenurodyta"}`
        )
      })
    } else {
      console.log("\n⚠️  Duomenų bazėje nėra vartotojų")
      console.log("   Naudokite: npm run create-admin")
    }

    // Patikrinimas ar yra admin vartotojų
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    })
    console.log(`\n👑 Admin vartotojų skaičius: ${adminCount}`)

    if (adminCount === 0) {
      console.log("   ⚠️  Nėra admin vartotojų!")
      console.log("   Naudokite: npm run create-admin")
    }
  } catch (error) {
    console.error("❌ Klaida:", error)
    if (error instanceof Error) {
      console.error("   Message:", error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
