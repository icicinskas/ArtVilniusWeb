// Scriptas default nuorodų inicijavimui duomenų bazėje
import { initializeDefaultNavigationLinks } from "../lib/navigation"

async function main() {
  console.log("Initializing default navigation links...")
  await initializeDefaultNavigationLinks()
  console.log("Done!")
  process.exit(0)
}

main().catch((error) => {
  console.error("Error initializing navigation links:", error)
  process.exit(1)
})
