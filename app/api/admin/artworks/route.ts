import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      imageMetadata,
      price,
      category,
      technique,
      dimensions,
      year,
      isForSale,
      isPublished,
      exhibitionId,
      collectionId,
      showInShop,
    } = body

    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { error: "Pavadinimas, paveikslėlis ir kategorija yra privalomi" },
        { status: 400 }
      )
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        imageMetadata:
          imageMetadata != null ? JSON.stringify(imageMetadata) : null,
        price: price != null ? Number(price) : null,
        category,
        technique: technique || null,
        dimensions: dimensions || null,
        year: year != null ? Number(year) : null,
        isForSale: Boolean(isForSale),
        isPublished: Boolean(isPublished),
        exhibitionId: exhibitionId || null,
        collectionId: collectionId || null,
        showInShop: Boolean(showInShop),
      },
    })

    return NextResponse.json(
      { success: true, artwork },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating artwork:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
