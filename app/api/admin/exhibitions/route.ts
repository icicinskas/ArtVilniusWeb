import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Parodos pavadinimas yra privalomas" },
        { status: 400 }
      )
    }

    const exhibition = await prisma.exhibition.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    })

    return NextResponse.json(
      { success: true, exhibition },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating exhibition:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
