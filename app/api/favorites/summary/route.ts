import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { isValidFavoriteTargetType } from "@/types/database"

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
    const rawIds = searchParams.get("targetIds") || ""
    const targetIds = rawIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)

    if (!isValidFavoriteTargetType(targetType)) {
      return NextResponse.json(
        { error: "Invalid target type" },
        { status: 400 }
      )
    }

    const counts = await favoriteModel.groupBy({
      by: ["targetId"],
      _count: { targetId: true },
      where: {
        targetType,
        ...(targetIds.length > 0 ? { targetId: { in: targetIds } } : {}),
      },
    })

    const countMap = targetIds.length > 0
      ? Object.fromEntries(targetIds.map((id) => [id, 0]))
      : {}

    counts.forEach((entry) => {
      countMap[entry.targetId] = entry._count.targetId
    })

    return NextResponse.json({ counts: countMap }, { status: 200 })
  } catch (error) {
    console.error("Error fetching favorites summary:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
