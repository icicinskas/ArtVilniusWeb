import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/lib/routing"
import { ModeratorSidebar } from "@/components/moderator/ModeratorSidebar"
import { requireModerator } from "@/lib/session"
import { Toaster } from "@/components/ui/toaster"
import "../../globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ModeratorLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Reikalaujame MODERATOR arba ADMIN rolės
  await requireModerator()

  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen bg-gray-50">
        <ModeratorSidebar locale={locale} />
        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
      <Toaster />
    </NextIntlClientProvider>
  )
}
