// Server component wrapper, kuris gauna nuorodas ir perduoda jas client komponentui
import { Header } from "./Header"
import { getNavigationLinks } from "@/lib/navigation"

export async function HeaderWrapper() {
  const navigationLinks = await getNavigationLinks("HEADER")
  return <Header navigationLinks={navigationLinks} />
}
