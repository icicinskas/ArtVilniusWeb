import { useTranslations } from "next-intl"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  const t = useTranslations("auth")

  return (
    <div className="container px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t("signIn")}</h1>
        <p className="text-muted-foreground mb-8">{t("signInDescription")}</p>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">{t("noAccount")} </span>
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>
    </div>
  )
}
