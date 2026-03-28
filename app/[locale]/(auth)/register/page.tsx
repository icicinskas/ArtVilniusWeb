import { useTranslations } from "next-intl"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  const t = useTranslations("auth")

  return (
    <div className="container px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t("signUp")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("signUpDescription")}
        </p>

        <RegisterForm />

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">{t("hasAccount")} </span>
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  )
}
