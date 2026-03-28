"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/routing"

export function CallToActionBanner() {
  const t = useTranslations("common")
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <>
      {/* Backdrop su šviesesniu fonu (be blur) - pointer-events-none, kad neblokuotų interakcijos */}
      <div className="fixed inset-0 bg-white/20 z-40 pointer-events-none" />
      
      {/* Modalinis langas - statiškai pritvirtintas prie ekrano apačios */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center pb-4 sm:pb-6 px-3 sm:px-4 pointer-events-auto lg:left-64">
        <div className="relative max-w-4xl w-full bg-gray-900/70 rounded-lg p-4 sm:p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1 text-center md:text-left min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                {t("ctaTitle")}
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                {t("ctaSubtitle")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 shrink-0">
              <Button
                variant="outline"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                onClick={() => setIsDismissed(true)}
              >
                {t("noThanks")}
              </Button>
              <Link href="/register" onClick={() => setIsDismissed(true)}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {t("signUpNow")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
