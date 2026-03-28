import { prisma } from "@/lib/db"

/**
 * Gauna visus parduodamus ir publikuotus meno kūrinius (parduotuvės puslapyje)
 */
export async function getArtworksForSale() {
  return prisma.artwork.findMany({
    where: {
      showInShop: true,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}


/**
 * Gauna vieną parduotuvės kūrinį pagal ID
 */
export async function getArtworkForSaleById(id: string) {
  return prisma.artwork.findFirst({
    where: {
      id,
      showInShop: true,
      isPublished: true,
    },
  })
}
