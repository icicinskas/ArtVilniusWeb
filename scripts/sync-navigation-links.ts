// Scriptas nuorodų sinchronizavimui su konfigūracija
import { syncNavigationLinksWithConfig } from "../lib/navigation"

async function main() {
  console.log("Synchronizing navigation links with config...")
  await syncNavigationLinksWithConfig()
  console.log("Done!")
  process.exit(0)
}

main().catch((error) => {
  console.error("Error synchronizing navigation links:", error)
  process.exit(1)
})
