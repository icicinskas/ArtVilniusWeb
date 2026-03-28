import { NextResponse } from "next/server"
import { getAllExhibitions } from "@/lib/exhibitions-db"

export async function GET() {
  try {
    const exhibitions = await getAllExhibitions()
    return NextResponse.json(exhibitions)
  } catch (error) {
    console.error("Error fetching exhibitions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
