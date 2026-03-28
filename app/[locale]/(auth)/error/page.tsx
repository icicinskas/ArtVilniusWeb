import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const t = useTranslations("auth")
  const error = searchParams?.error

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "Configuration":
        return "Yra konfigūracijos problema. Susisiekite su administratoriumi."
      case "AccessDenied":
        return "Jūs neturite teisių prieiti prie šio puslapio."
      case "Verification":
        return "Patvirtinimo klaida. Bandykite dar kartą."
      default:
        return "Įvyko autentifikacijos klaida. Bandykite prisijungti dar kartą."
    }
  }

  return (
    <div className="container px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{t("error")}</h1>
        <p className="text-muted-foreground mb-8">
          {getErrorMessage(error)}
        </p>
        <div className="space-y-4">
          <Button asChild>
            <Link href="/login">{t("signIn")}</Link>
          </Button>
          <div>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              Grįžti į pagrindinį puslapį
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
