"use client"

import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname, useRouter } from "@/lib/routing"
import { Button } from "@/components/ui/button"
import { Search, User, X, Languages, Menu } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/contexts/SidebarContext"
import { NavigationLink } from "@/lib/navigation"

interface HeaderProps {
  navigationLinks: NavigationLink[]
}

export function Header({ navigationLinks }: HeaderProps) {
  const t = useTranslations("common")
  const pathname = usePathname()
  const locale = useLocale()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toggleSidebar } = useSidebar()

  const navigation = navigationLinks.map((link) => ({
    name: t(link.translationKey),
    href: link.href,
  }))

  const languages = [
    { code: "lt", name: "Lietuvių" },
    { code: "en", name: "English" },
  ]

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white">
      <div className="flex h-14">
        <div className="hidden lg:flex items-center gap-2 w-64 px-4 border-r border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-base font-medium">{t("studioName")}</span>
        </div>

        <div className="flex flex-1 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 shrink-0 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-base font-medium">{t("studioName")}</span>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-2 sm:gap-4 lg:gap-6 max-w-[1120px] mx-auto min-w-0 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-2 ${
                  pathname === item.href
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 px-2 text-sm font-medium flex items-center gap-2"
                >
                  {languages.find((language) => language.code === locale)?.name || locale}
                  <span className="text-xs">✓</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={locale === language.code ? "bg-accent" : ""}
                  >
                    {language.name}
                    {locale === language.code && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer">
                    {t("login")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register" className="cursor-pointer">
                    {t("register")}
                  </Link>
                </DropdownMenuItem>
                <div className="border-t my-1" />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[min(100vw,24rem)] overflow-y-auto bg-background p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold">Art Vilna</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login">{t("login")}</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/register">{t("register")}</Link>
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">{t("language")}</div>
                  <div className="space-y-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          handleLanguageChange(language.code)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          locale === language.code
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {language.name}
                        {locale === language.code && (
                          <span className="ml-2 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
