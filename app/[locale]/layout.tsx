import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/lib/routing"
import { HeaderWrapper } from "@/components/layout/HeaderWrapper"
import { Footer } from "@/components/layout/Footer"
import { SidebarWrapper } from "@/components/layout/SidebarWrapper"
import { SidebarProvider } from "@/contexts/SidebarContext"
import { Toaster } from "@/components/ui/toaster"
import "../globals.css"

export const metadata: Metadata = {
  title: "Art Vilna",
  description: "Vilniaus meno parodos ir parduotuvė",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
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

  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SidebarProvider>
        <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
          <HeaderWrapper />
          <div className="flex flex-1 pt-14">
            <SidebarWrapper />
            <main className="flex-1 lg:pl-64">
              <div className="px-4 md:px-6 w-full max-w-[1120px] mx-auto">{children}</div>
            </main>
          </div>
          <Footer />
        </div>
        <Toaster />
      </SidebarProvider>
    </NextIntlClientProvider>
  )
}
