import { Suspense } from "react"
import { EducationPageContent } from "@/components/education/EducationPageContent"

export default function EducationPage() {
  return (
    <Suspense
      fallback={
        <div className="container px-4 py-12 max-w-7xl mx-auto animate-pulse">
          <div className="h-10 bg-muted rounded w-48 mb-4" />
          <div className="h-5 bg-muted rounded w-96 mb-8" />
          <div className="flex gap-8">
            <div className="w-48 space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
            </div>
            <div className="flex-1">
              <div className="h-8 bg-muted rounded w-24 mb-6" />
              <div className="grid grid-cols-2 gap-6">
                <div className="h-64 bg-muted rounded" />
                <div className="h-64 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EducationPageContent />
    </Suspense>
  )
}
