import { prisma } from "@/lib/db"

export async function getAllCollections() {
  return prisma.collection.findMany({
    orderBy: { order: "asc" },
    include: {
      artworks: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getCollectionById(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      artworks: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}
