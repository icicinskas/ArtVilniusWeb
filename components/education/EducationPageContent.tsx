"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/routing"
import {
  getActivitiesByYear,
  getAvailableYears,
} from "@/lib/educational-activities"
import { EducationActivityCard } from "./EducationActivityCard"

export function EducationPageContent() {
  const t = useTranslations("common")
  const tEducation = useTranslations("educationPage")
  const searchParams = useSearchParams()

  const availableYears = getAvailableYears()
  const yearParam = searchParams.get("year")
  const selectedYear = yearParam
    ? parseInt(yearParam, 10)
    : availableYears[0] ?? new Date().getFullYear()

  const isValidYear = availableYears.includes(selectedYear)
  const displayYear = isValidYear ? selectedYear : availableYears[0]
  const activities = displayYear
    ? getActivitiesByYear(displayYear)
    : []

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">{t("education")}</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {tEducation("subtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <aside className="lg:w-48 shrink-0 order-2 lg:order-1">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {tEducation("viewByYear")}
          </h2>
          <nav className="flex flex-col gap-1">
            {availableYears.map((year) => (
              <Link
                key={year}
                href={`/education?year=${year}`}
                className={`
                  py-2 px-3 rounded-md text-left transition-colors
                  ${
                    year === displayYear
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {year}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 order-1 lg:order-2">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{displayYear}</h2>

          {activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity) => (
                <EducationActivityCard
                  key={activity.id}
                  activity={activity}
                  learnMoreText={t("learnMore")}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8">
              {tEducation("noActivities")}
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
