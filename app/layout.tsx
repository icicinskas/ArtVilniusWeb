import { routing } from "@/lib/routing"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
