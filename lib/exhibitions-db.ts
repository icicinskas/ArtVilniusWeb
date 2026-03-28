import { prisma } from "@/lib/db"

export async function getAllExhibitions() {
  return prisma.exhibition.findMany({
    orderBy: { order: "asc" },
    include: {
      artworks: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getExhibitionById(id: string) {
  return prisma.exhibition.findUnique({
    where: { id },
    include: {
      artworks: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}
