// Scriptas nuorodų patikrai
import { prisma } from "../lib/db"

async function main() {
  console.log("Checking sidebar navigation links...\n")
  
  const sidebarLinks = await prisma.navigationLink.findMany({
    where: {
      location: "SIDEBAR",
    },
    orderBy: {
      order: "asc",
    },
  })

  console.log("All SIDEBAR links:")
  sidebarLinks.forEach((link) => {
    const status = link.isActive ? "✓ ACTIVE" : "✗ INACTIVE"
    console.log(`${status} - ${link.translationKey} (${link.href}) - order: ${link.order}`)
  })

  console.log("\nActive SIDEBAR links:")
  const activeLinks = sidebarLinks.filter((link) => link.isActive)
  activeLinks.forEach((link) => {
    console.log(`- ${link.translationKey} (${link.href})`)
  })

  process.exit(0)
}

main().catch((error) => {
  console.error("Error checking navigation links:", error)
  process.exit(1)
})
