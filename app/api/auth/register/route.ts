import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Server-side validacija
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Netinkami duomenys",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data

    // Patikrinimas ar email jau egzistuoja
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Vartotojas su šiuo el. paštu jau egzistuoja",
        },
        { status: 409 }
      )
    }

    // Slaptažodžio hash'inimas
    const hashedPassword = await bcrypt.hash(password, 12)

    // Vartotojo sukūrimas
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: "USER", // Default role
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Registracija sėkminga. Galite prisijungti.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Įvyko klaida registracijos metu",
      },
      { status: 500 }
    )
  }
}
