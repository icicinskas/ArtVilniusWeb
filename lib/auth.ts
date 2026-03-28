import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

// Patikrinimas ar NEXTAUTH_SECRET yra nustatytas
if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "⚠️  NEXTAUTH_SECRET nėra nustatytas. Autentifikacija gali neveikti."
  )
}

// Patikrinimas ar NEXTAUTH_URL yra nustatytas
if (!process.env.NEXTAUTH_URL) {
  console.warn(
    "⚠️  NEXTAUTH_URL nėra nustatytas. Nustatykite jį .env faile (pvz., http://localhost:3000)"
  )
}

// NextAuth v5 beta sintaksė
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Authorize: Missing credentials")
            return null
          }

          console.log("Authorize: Looking for user with email:", credentials.email)

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.log("Authorize: User not found")
            return null
          }

          console.log("Authorize: User found, role:", user.role)

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log("Authorize: Invalid password")
            return null
          }

          console.log("Authorize: Password valid, returning user")

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          if (error instanceof Error) {
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    // error page bus automatiškai nukreiptas į /api/auth/error
    // bet mes turime custom puslapį app/[locale]/(auth)/error/page.tsx
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
