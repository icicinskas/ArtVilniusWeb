import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "@/lib/session"
import { isValidFavoriteTargetType } from "@/types/database"

const getTargetValidationError = (targetType: string, body: Record<string, unknown>) => {
  if (targetType === "ARTIST") {
    if (!body.artistFirstName || !body.artistLastName) {
      return "Missing artist name"
    }
  }

  if (targetType === "ARTWORK") {
    if (!body.artworkTitle || !body.artworkArtistName) {
      return "Missing artwork details"
    }
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const favoriteModel = (prisma as any).favoriteAction
    if (!favoriteModel) {
      return NextResponse.json(
        { error: "Favorites not initialized" },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const targetType = searchParams.get("targetType") || ""
    const targetId = searchParams.get("targetId") || ""

    if (!isValidFavoriteTargetType(targetType) || !targetId) {
      return NextResponse.json(
        { error: "Invalid target" },
        { status: 400 }
      )
    }

    const count = await favoriteModel.count({
      where: { targetType, targetId },
    })

    const session = await getServerSession()
    let isFavorited = false

    if (session?.user?.id) {
      const existing = await favoriteModel.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: session.user.id,
            targetType,
            targetId,
          },
        },
        select: { id: true },
      })
      isFavorited = Boolean(existing)
    }

    return NextResponse.json({ count, isFavorited }, { status: 200 })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  let targetType = ""
  let targetId = ""

  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    targetType = String(body.targetType || "")
    targetId = String(body.targetId || "")

    if (!isValidFavoriteTargetType(targetType) || !targetId) {
      return NextResponse.json(
        { error: "Invalid target" },
        { status: 400 }
      )
    }

    const validationError = getTargetValidationError(targetType, body)
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }

    const existing = await favoriteModel.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: session.user.id,
          targetType,
          targetId,
        },
      },
      select: { id: true },
    })

    if (existing) {
      const count = await favoriteModel.count({
        where: { targetType, targetId },
      })
      return NextResponse.json(
        { count, isFavorited: true, alreadyExists: true },
        { status: 200 }
      )
    }

    const [_, count] = await prisma.$transaction([
      favoriteModel.create({
        data: {
          userId: session.user.id,
          targetType,
          targetId,
          artistFirstName: body.artistFirstName || null,
          artistLastName: body.artistLastName || null,
          artworkTitle: body.artworkTitle || null,
          artworkArtistName: body.artworkArtistName || null,
        },
      }),
      favoriteModel.count({
        where: { targetType, targetId },
      }),
    ])

    return NextResponse.json(
      { count, isFavorited: true, alreadyExists: false },
      { status: 201 }
    )
  } catch (error: any) {
    if (error?.code === "P2002") {
      const count = await favoriteModel.count({
        where: { targetType, targetId },
      })
      return NextResponse.json(
        { count, isFavorited: true, alreadyExists: true },
        { status: 200 }
      )
    }

    console.error("Error saving favorite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
